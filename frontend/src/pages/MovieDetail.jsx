import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { movieAPI } from '../services/api';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await movieAPI.getTMDBDetails(id);
      setMovie(response.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!movie) return <div>Movie not found</div>;

  return (
    <div className="movie-detail">
      <div className="movie-detail-content">
        {movie.poster_path && (
          <img 
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="movie-detail-poster"
          />
        )}
        <div className="movie-detail-info">
          <h1>{movie.title}</h1>
          <p className="movie-tagline">{movie.tagline}</p>
          <div className="movie-meta">
            <span>⭐ {movie.vote_average?.toFixed(1)}/10</span>
            <span>{movie.release_date}</span>
            <span>{movie.runtime} min</span>
          </div>
          <p className="movie-overview">{movie.overview}</p>
          <div className="movie-genres">
            {movie.genres?.map(genre => (
              <span key={genre.id} className="genre-badge">{genre.name}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
