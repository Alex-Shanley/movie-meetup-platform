from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django.utils import timezone
from .models import Meetup, MeetupParticipant, MeetupComment
from .serializers import (
    MeetupSerializer,
    MeetupDetailSerializer,
    MeetupCreateSerializer,
    MeetupParticipantSerializer,
    MeetupCommentSerializer,
    JoinMeetupSerializer
)


class MeetupViewSet(viewsets.ModelViewSet):
    """CRUD operations for meetups"""
    queryset = Meetup.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'create':
            return MeetupCreateSerializer
        elif self.action == 'retrieve':
            return MeetupDetailSerializer
        return MeetupSerializer

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

    def get_queryset(self):
        queryset = Meetup.objects.all()
        
        # Filter by status
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        # Filter by movie
        movie_id = self.request.query_params.get('movie')
        if movie_id:
            queryset = queryset.filter(movie_id=movie_id)
        
        # Filter upcoming meetups
        upcoming = self.request.query_params.get('upcoming')
        if upcoming == 'true':
            queryset = queryset.filter(
                meetup_datetime__gte=timezone.now(),
                status='upcoming'
            )
        
        # Filter user's meetups
        my_meetups = self.request.query_params.get('my_meetups')
        if my_meetups == 'true' and self.request.user.is_authenticated:
            queryset = queryset.filter(organizer=self.request.user)
        
        return queryset

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def join(self, request, pk=None):
        """Join a meetup"""
        meetup = self.get_object()
        
        # Check if user is the organizer
        if meetup.organizer == request.user:
            return Response(
                {'error': 'You are the organizer of this meetup'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if meetup is full
        if meetup.is_full:
            return Response(
                {'error': 'This meetup is full'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if already joined
        if MeetupParticipant.objects.filter(meetup=meetup, user=request.user).exists():
            return Response(
                {'error': 'You have already joined this meetup'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = JoinMeetupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        participant = MeetupParticipant.objects.create(
            meetup=meetup,
            user=request.user,
            message=serializer.validated_data.get('message', '')
        )
        
        return Response(
            MeetupParticipantSerializer(participant).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def leave(self, request, pk=None):
        """Leave a meetup"""
        meetup = self.get_object()
        
        try:
            participant = MeetupParticipant.objects.get(meetup=meetup, user=request.user)
            participant.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except MeetupParticipant.DoesNotExist:
            return Response(
                {'error': 'You are not a participant of this meetup'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['get'])
    def participants(self, request, pk=None):
        """Get meetup participants"""
        meetup = self.get_object()
        participants = meetup.participants.all()
        serializer = MeetupParticipantSerializer(participants, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def comment(self, request, pk=None):
        """Add a comment to meetup"""
        meetup = self.get_object()
        
        comment = MeetupComment.objects.create(
            meetup=meetup,
            user=request.user,
            text=request.data.get('text', '')
        )
        
        serializer = MeetupCommentSerializer(comment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        """Get meetup comments"""
        meetup = self.get_object()
        comments = meetup.comments.all()
        serializer = MeetupCommentSerializer(comments, many=True)
        return Response(serializer.data)


class MeetupParticipantViewSet(viewsets.ReadOnlyModelViewSet):
    """View meetup participants"""
    queryset = MeetupParticipant.objects.all()
    serializer_class = MeetupParticipantSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = MeetupParticipant.objects.all()
        
        # Filter by meetup
        meetup_id = self.request.query_params.get('meetup')
        if meetup_id:
            queryset = queryset.filter(meetup_id=meetup_id)
        
        # Filter by user
        user_id = self.request.query_params.get('user')
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        
        return queryset


class MeetupCommentViewSet(viewsets.ModelViewSet):
    """CRUD operations for meetup comments"""
    queryset = MeetupComment.objects.all()
    serializer_class = MeetupCommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        queryset = MeetupComment.objects.all()
        
        # Filter by meetup
        meetup_id = self.request.query_params.get('meetup')
        if meetup_id:
            queryset = queryset.filter(meetup_id=meetup_id)
        
        return queryset
