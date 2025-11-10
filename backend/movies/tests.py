from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Movie, MovieRating, Favorite
from datetime import date


class MovieModelTest(TestCase):
    def setUp(self):
        self.movie = Movie.objects.create(
            title="Test Movie",
            description="A test movie",
            release_date=date(2024, 1, 1),
            rating=8.5
        )

    def test_movie_creation(self):
        self.assertEqual(self.movie.title, "Test Movie")
        self.assertEqual(str(self.movie), "Test Movie")


class MovieRatingTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.movie = Movie.objects.create(
            title="Test Movie",
            description="A test movie",
            release_date=date(2024, 1, 1)
        )

    def test_movie_rating_creation(self):
        rating = MovieRating.objects.create(
            user=self.user,
            movie=self.movie,
            rating=5,
            review="Great movie!"
        )
        self.assertEqual(rating.rating, 5)
        self.assertEqual(rating.review, "Great movie!")


class MovieAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.movie = Movie.objects.create(
            title="Test Movie",
            description="A test movie",
            release_date=date(2024, 1, 1)
        )

    def test_get_movies_list(self):
        response = self.client.get('/api/movies/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_movie_rating_authenticated(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'movie': self.movie.id,
            'rating': 5,
            'review': 'Excellent!'
        }
        response = self.client.post('/api/movies/ratings/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_movie_rating_unauthenticated(self):
        data = {
            'movie': self.movie.id,
            'rating': 5,
            'review': 'Excellent!'
        }
        response = self.client.post('/api/movies/ratings/', data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
