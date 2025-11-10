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
    class Meta:
        model = Meetup
        fields = [
            'title', 'description', 'movie', 'location', 'theater_name', 
            'meetup_datetime', 'max_participants'
        ]


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
