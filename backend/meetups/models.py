from django.db import models
from django.contrib.auth.models import User
from movies.models import Movie


class Meetup(models.Model):
    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='meetups')
    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='organized_meetups')
    location = models.CharField(max_length=200)
    theater_name = models.CharField(max_length=200, blank=True)
    meetup_datetime = models.DateTimeField()
    max_participants = models.IntegerField(default=10)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='upcoming')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['meetup_datetime']

    def __str__(self):
        return f"{self.title} - {self.movie.title}"

    @property
    def participants_count(self):
        return self.participants.filter(status='accepted').count() + 1  # +1 for organizer

    @property
    def is_full(self):
        return self.participants_count >= self.max_participants

    @property
    def available_spots(self):
        return self.max_participants - self.participants_count


class MeetupParticipant(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
    ]

    meetup = models.ForeignKey(Meetup, on_delete=models.CASCADE, related_name='participants')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meetup_participations')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='accepted')
    message = models.TextField(blank=True, help_text="Optional message to organizer")
    joined_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['meetup', 'user']
        ordering = ['joined_at']

    def __str__(self):
        return f"{self.user.username} - {self.meetup.title} ({self.status})"


class MeetupComment(models.Model):
    meetup = models.ForeignKey(Meetup, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meetup_comments')
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} on {self.meetup.title}"
