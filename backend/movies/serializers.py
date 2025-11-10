from rest_framework import serializers
from .models import Movie, MovieRating, Favorite
from accounts.serializers import UserSerializer


class MovieSerializer(serializers.ModelSerializer):
    average_user_rating = serializers.ReadOnlyField()

    class Meta:
        model = Movie
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class MovieRatingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    movie_title = serializers.CharField(source='movie.title', read_only=True)

    class Meta:
        model = MovieRating
        fields = ['id', 'user', 'movie', 'movie_title', 'rating', 'review', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class MovieRatingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovieRating
        fields = ['movie', 'rating', 'review']


class FavoriteSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    movie = MovieSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'user', 'movie', 'created_at']
        read_only_fields = ['created_at']


class MovieDetailSerializer(serializers.ModelSerializer):
    average_user_rating = serializers.ReadOnlyField()
    ratings = MovieRatingSerializer(source='movie_ratings', many=True, read_only=True)
    ratings_count = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = '__all__'

    def get_ratings_count(self, obj):
        return obj.movie_ratings.count()
