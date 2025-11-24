from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MovieViewSet,
    MovieRatingViewSet,
    FavoriteViewSet,
    search_tmdb_movies,
    get_tmdb_movie_details,
    get_movie_recommendations,
    get_movie_reviews,
    get_popular_movies
)

router = DefaultRouter()
router.register('', MovieViewSet, basename='movie')
router.register('ratings', MovieRatingViewSet, basename='movie-rating')
router.register('favorites', FavoriteViewSet, basename='favorite')

urlpatterns = [
    path('tmdb/search/', search_tmdb_movies, name='tmdb-search'),
    path('tmdb/popular/', get_popular_movies, name='tmdb-popular'),
    path('tmdb/<int:tmdb_id>/', get_tmdb_movie_details, name='tmdb-detail'),
    path('tmdb/<int:tmdb_id>/recommendations/', get_movie_recommendations, name='tmdb-recommendations'),
    path('tmdb/<int:tmdb_id>/reviews/', get_movie_reviews, name='tmdb-reviews'),
    path('', include(router.urls)),
]
