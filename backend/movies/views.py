from rest_framework import generics, status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from django.conf import settings
import requests
from .models import Movie, MovieRating, Favorite
from .serializers import (
    MovieSerializer, 
    MovieDetailSerializer, 
    MovieRatingSerializer,
    MovieRatingCreateSerializer,
    FavoriteSerializer
)


class MovieViewSet(viewsets.ModelViewSet):
    """CRUD operations for movies"""
    queryset = Movie.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return MovieDetailSerializer
        return MovieSerializer

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search movies by title"""
        query = request.query_params.get('q', '')
        movies = self.queryset.filter(title__icontains=query)
        serializer = self.get_serializer(movies, many=True)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def search_tmdb_movies(request):
    """Search movies from TMDB API"""
    query = request.query_params.get('q', '')
    
    if not query:
        return Response({'error': 'Query parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    api_key = settings.TMDB_API_KEY
    if not api_key:
        return Response({'error': 'TMDB API key not configured'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    url = f"{settings.TMDB_BASE_URL}/search/movie"
    params = {
        'api_key': api_key,
        'query': query,
        'language': 'en-US',
        'page': 1
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return Response(response.json())
    except requests.RequestException as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_tmdb_movie_details(request, tmdb_id):
    """Get movie details from TMDB API"""
    api_key = settings.TMDB_API_KEY
    if not api_key:
        return Response({'error': 'TMDB API key not configured'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    url = f"{settings.TMDB_BASE_URL}/movie/{tmdb_id}"
    params = {
        'api_key': api_key,
        'language': 'en-US'
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return Response(response.json())
    except requests.RequestException as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_popular_movies(request):
    """Get popular movies from TMDB API"""
    api_key = settings.TMDB_API_KEY
    if not api_key:
        return Response({'error': 'TMDB API key not configured'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    url = f"{settings.TMDB_BASE_URL}/movie/popular"
    params = {
        'api_key': api_key,
        'language': 'en-US',
        'page': request.query_params.get('page', 1)
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return Response(response.json())
    except requests.RequestException as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class MovieRatingViewSet(viewsets.ModelViewSet):
    """CRUD operations for movie ratings"""
    queryset = MovieRating.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return MovieRatingCreateSerializer
        return MovieRatingSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        queryset = MovieRating.objects.all()
        movie_id = self.request.query_params.get('movie')
        if movie_id:
            queryset = queryset.filter(movie_id=movie_id)
        return queryset


class FavoriteViewSet(viewsets.ModelViewSet):
    """CRUD operations for favorites"""
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        movie_id = request.data.get('movie_id')
        if not movie_id:
            return Response({'error': 'movie_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        favorite, created = Favorite.objects.get_or_create(
            user=request.user,
            movie_id=movie_id
        )
        
        if not created:
            return Response({'message': 'Already in favorites'}, status=status.HTTP_200_OK)
        
        serializer = self.get_serializer(favorite)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['delete'])
    def remove(self, request):
        movie_id = request.data.get('movie_id')
        if not movie_id:
            return Response({'error': 'movie_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            favorite = Favorite.objects.get(user=request.user, movie_id=movie_id)
            favorite.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Favorite.DoesNotExist:
            return Response({'error': 'Not in favorites'}, status=status.HTTP_404_NOT_FOUND)
