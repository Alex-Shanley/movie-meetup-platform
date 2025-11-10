from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MeetupViewSet, MeetupParticipantViewSet, MeetupCommentViewSet

router = DefaultRouter()
router.register('', MeetupViewSet, basename='meetup')
router.register('participants', MeetupParticipantViewSet, basename='meetup-participant')
router.register('comments', MeetupCommentViewSet, basename='meetup-comment')

urlpatterns = [
    path('', include(router.urls)),
]
