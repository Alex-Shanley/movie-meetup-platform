from rest_framework import serializers
from .models import Meetup, MeetupParticipant, MeetupComment
from movies.serializers import MovieSerializer
from accounts.serializers import UserSerializer


class MeetupParticipantSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = MeetupParticipant
        fields = ['id', 'user', 'status', 'message', 'joined_at', 'updated_at']
        read_only_fields = ['joined_at', 'updated_at']


class MeetupCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = MeetupComment
        fields = ['id', 'user', 'text', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class MeetupSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)
    organizer = UserSerializer(read_only=True)
    participants_count = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()
    available_spots = serializers.ReadOnlyField()

    class Meta:
        model = Meetup
        fields = [
            'id', 'title', 'description', 'movie', 'organizer', 'location', 
            'theater_name', 'meetup_datetime', 'max_participants', 'status',
            'participants_count', 'is_full', 'available_spots', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class MeetupCreateSerializer(serializers.ModelSerializer):
    movie_name = serializers.CharField(write_only=True, required=False)
    movie = serializers.IntegerField(write_only=True)  # Accept TMDB ID as integer
    
    class Meta:
        model = Meetup
        fields = [
            'title', 'description', 'movie', 'movie_name', 'location', 'theater_name', 
            'meetup_datetime', 'max_participants'
        ]
    
    def create(self, validated_data):
        from movies.models import Movie
        import requests
        from django.conf import settings
        
        movie_id = validated_data.get('movie')
        movie_name = validated_data.pop('movie_name', None)
        
        # If movie ID is provided, check if it's a local DB ID or TMDB ID
        if movie_id:
            # Try to get from local database first
            try:
                movie = Movie.objects.get(id=movie_id)
            except Movie.DoesNotExist:
                # If not found, assume it's a TMDB ID and create/get the movie
                try:
                    # Fetch from TMDB API
                    tmdb_api_key = settings.TMDB_API_KEY
                    response = requests.get(
                        f'https://api.themoviedb.org/3/movie/{movie_id}',
                        params={'api_key': tmdb_api_key}
                    )
                    movie_data = response.json()
                    
                    # Create or get the movie in local database
                    from datetime import date
                    release_date_str = movie_data.get('release_date')
                    if release_date_str:
                        from datetime import datetime
                        release_date = datetime.strptime(release_date_str, '%Y-%m-%d').date()
                    else:
                        release_date = date.today()
                    
                    movie, created = Movie.objects.get_or_create(
                        tmdb_id=movie_id,
                        defaults={
                            'title': movie_data.get('title', movie_name or 'Unknown'),
                            'description': movie_data.get('overview', 'No description available'),
                            'release_date': release_date,
                            'poster_url': f"https://image.tmdb.org/t/p/w500{movie_data['poster_path']}" if movie_data.get('poster_path') else '',
                            'genre': ', '.join([g['name'] for g in movie_data.get('genres', [])]) if movie_data.get('genres') else '',
                            'rating': movie_data.get('vote_average', 0.0),
                        }
                    )
                except Exception as e:
                    # If TMDB fetch fails, create a basic movie entry
                    from datetime import date
                    movie, created = Movie.objects.get_or_create(
                        title=movie_name or 'Unknown Movie',
                        defaults={
                            'tmdb_id': movie_id,
                            'description': 'No description available',
                            'release_date': date.today()
                        }
                    )
            
            validated_data['movie'] = movie
        
        return super().create(validated_data)


class MeetupDetailSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)
    organizer = UserSerializer(read_only=True)
    participants = MeetupParticipantSerializer(many=True, read_only=True)
    comments = MeetupCommentSerializer(many=True, read_only=True)
    participants_count = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()
    available_spots = serializers.ReadOnlyField()

    class Meta:
        model = Meetup
        fields = [
            'id', 'title', 'description', 'movie', 'organizer', 'location',
            'theater_name', 'meetup_datetime', 'max_participants', 'status',
            'participants_count', 'is_full', 'available_spots',
            'participants', 'comments', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class JoinMeetupSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeetupParticipant
        fields = ['message']
