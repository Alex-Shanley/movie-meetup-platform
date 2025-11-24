import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { movieAPI } from '../services/api';

const SHOWTIME_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SHOWTIME_GROUPS = [
  { label: '4DX 2D', times: ['11:10', '14:20', '17:30', '20:40'] },
  { label: '2D', times: ['12:20', '15:30'] },
  { label: 'IMAX 2D', times: ['16:30', '19:40'] },
];

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(SHOWTIME_DAYS[0]);

  useEffect(() => {
    fetchMovieDetails();
    fetchSimilarMovies();
    fetchReviews();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await movieAPI.getTMDBDetails(id);
      setMovie(response.data);
      setCast(response.data.credits?.cast || []);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimilarMovies = async () => {
    try {
      const response = await movieAPI.getTMDBRecommendations(id, 1);
      setSimilarMovies(response.data.results || []);
    } catch (error) {
      console.error('Error fetching similar movies:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await movieAPI.getTMDBReviews(id, 1);
      setReviews(response.data.results || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!movie) return <div>Movie not found</div>;

  const releaseYear = movie.release_date?.split('-')[0];
  const primaryGenres = movie.genres?.map((g) => g.name).join(' • ');

  const backdropStyle = movie.backdrop_path
    ? { backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }
    : {};

  return (
    <div className="movie-detail-page">
      <section className="movie-detail-hero" style={backdropStyle}>
        <div className="movie-detail-hero-overlay" />
        <div className="movie-detail-hero-content">
          <div className="movie-detail-info">
            <div className="movie-detail-year">
              {releaseYear && <span>{releaseYear}</span>}
              {primaryGenres && (
                <span>{releaseYear ? ' • ' : ''}{primaryGenres}</span>
              )}
            </div>
            <h1 className="movie-detail-title">{movie.title}</h1>
            {movie.tagline && (
              <p className="movie-detail-tagline">{movie.tagline}</p>
            )}
            <div className="movie-detail-meta">
              {movie.vote_average && (
                <span className="movie-detail-rating">
                  <span>IMDb</span>
                  <strong>{(movie.vote_average * 10).toFixed(0)}</strong>
                  <span>/ 100</span>
                </span>
              )}
              {movie.runtime && <span>{movie.runtime} min</span>}
              {movie.release_date && <span>{movie.release_date}</span>}
            </div>
            <div className="movie-detail-actions">
              <button type="button" className="movie-detail-btn-primary">
                Watch Trailer
              </button>
              <Link to="/meetups" className="movie-detail-btn-secondary">
                Find Movie Geeks
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="movie-detail-body">
        <div className="movie-detail-body-inner">
          {movie.overview && (
            <div className="movie-detail-description">
              <h3 className="movie-detail-section-heading">Description</h3>
              <p className="movie-detail-body-overview">{movie.overview}</p>
            </div>
          )}

          {cast.length > 0 && (
            <div className="movie-detail-cast">
              <h3 className="movie-detail-section-heading">Cast</h3>
              <div className="movie-detail-cast-row">
                {cast.slice(0, 6).map((person) => (
                  <div key={person.id} className="movie-detail-cast-card">
                    {person.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${person.profile_path}`}
                        alt={person.name}
                        className="movie-detail-cast-avatar"
                      />
                    ) : (
                      <div className="movie-detail-cast-avatar movie-detail-cast-avatar-placeholder">
                        {person.name?.[0] || '?'}
                      </div>
                    )}
                    <div className="movie-detail-cast-names">
                      <div className="movie-detail-cast-name">{person.name}</div>
                      {person.character && (
                        <div className="movie-detail-cast-role">{person.character}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {reviews.length > 0 && (
            <div className="movie-detail-reviews">
              <h3 className="movie-detail-reviews-heading">Reviews</h3>
              <div className="movie-detail-reviews-list">
                {reviews.slice(0, 4).map((review) => (
                  <div key={review.id} className="movie-detail-review-card">
                    <div className="movie-detail-review-header">
                      <div className="movie-detail-review-author">{review.author}</div>
                      {review.author_details?.rating != null && (
                        <div className="movie-detail-review-rating">
                          {review.author_details.rating}/10
                        </div>
                      )}
                    </div>
                    <p className="movie-detail-review-content">
                      {review.content && review.content.length > 350
                        ? `${review.content.slice(0, 350)}...`
                        : review.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {similarMovies.length > 0 && (
        <section className="movie-detail-similar">
          <div className="movie-detail-body-inner">
            <div className="movie-detail-similar-header">
              <h2>Similar Movies for you</h2>
            </div>
            <div className="trending-scroll">
              {similarMovies.slice(0, 5).map((similar) => {
                const hasVoteAverage =
                  typeof similar.vote_average === 'number';
                const rating = hasVoteAverage
                  ? similar.vote_average.toFixed(1)
                  : null;

                return (
                  <Link
                    key={similar.id}
                    to={`/movies/${similar.id}`}
                    className="trending-card-figma"
                  >
                    {similar.backdrop_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${similar.backdrop_path}`}
                        alt={similar.title}
                      />
                    )}
                    <h4 className="trending-title">{similar.title}</h4>
                    <div className="trending-info">
                      {rating && (
                        <span className="trending-rating">{rating}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default MovieDetail;
