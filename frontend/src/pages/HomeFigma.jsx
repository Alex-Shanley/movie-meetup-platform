import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieAPI } from '../services/api';
import '../styles/HomeFigma.css';

const EXCLUSIVE_TRAILERS_VISIBLE = 3;

const GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

const DEFAULT_SHOWTIMES = ['11:30', '14:45', '16:00', '18:00', '21:00', '23:15'];

const formatGenresFromIds = (genreIds) => {
  if (!Array.isArray(genreIds) || genreIds.length === 0) return null;
  const names = genreIds.map((id) => GENRE_MAP[id]).filter(Boolean);
  if (!names.length) return null;
  return names.slice(0, 3).join(', ');
};

const MovieCard = ({ movie }) => {
  const hasVoteAverage = typeof movie.vote_average === 'number';
  const imdbScore = hasVoteAverage ? (movie.vote_average * 10).toFixed(1) : null;
  const genreLabel = formatGenresFromIds(movie.genre_ids);
 
  return (
    <Link to={`/movies/${movie.id}`} className="movie-card-figma">
      <div className="movie-poster-figma">
        <img 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
      </div>
      <div className="movie-info-figma">
        <h4>{movie.title}</h4>
        <div className="movie-meta-figma">
          {hasVoteAverage && (
            <span className="rating-figma">
              <svg width="12" height="12" viewBox="0 0 20 20" fill="#ffa500">
                <path d="M10 1l2.5 6.5H19l-5.5 4 2 6.5L10 14l-5.5 4 2-6.5L1 7.5h6.5z"/>
              </svg>
              {`IMDb ${imdbScore} / 100`}
            </span>
          )}
          {genreLabel && <span className="genre-figma">{genreLabel}</span>}
        </div>
        <div className="showtimes-figma">
          {DEFAULT_SHOWTIMES.map((time, index) => (
            <span
              key={time}
              className={`time ${index === 0 ? 'active' : ''}`}
            >
              {time}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

const HomeFigma = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [trailers, setTrailers] = useState({});
  const [loading, setLoading] = useState(true);
  const [trailerStartIndex, setTrailerStartIndex] = useState(0);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await movieAPI.getPopular(1);
      const movies = response.data.results || [];
      setAllMovies(movies);
      
      // Fetch trailers for exclusive trailers section (use New Arrival movies)
      const trailerSource = movies.slice(4, 8);
      const trailerPromises = trailerSource.map(async (movie) => {
        try {
          const videoResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=785d439e0589204d58e902e188e23586`
          );
          const videoData = await videoResponse.json();
          const trailer = videoData.results?.find(
            (video) => video.type === 'Trailer' && video.site === 'YouTube'
          );
          return { movieId: movie.id, trailer };
        } catch (error) {
          console.error(`Error fetching trailer for ${movie.title}:`, error);
          return { movieId: movie.id, trailer: null };
        }
      });
      
      const trailerResults = await Promise.all(trailerPromises);
      const trailersMap = {};
      trailerResults.forEach(({ movieId, trailer }) => {
        if (trailer) {
          trailersMap[movieId] = trailer;
        }
      });
      setTrailers(trailersMap);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const heroMovie = allMovies[0];
  const featuredMovies = allMovies.slice(0, 4);
  const newArrivals = allMovies.slice(4, 8);
  const secondHero = allMovies[1];
  const trending = allMovies.slice(8, 12);
  const thirdHero = allMovies[2];

  // Build Most popular without Jujutsu Kaisen (its wide artwork breaks the grid)
  const mostPopular = allMovies
    .slice(12, 20)
    .filter((movie) => !movie.title?.toLowerCase().includes('jujutsu'))
    .slice(0, 4);

  const comingSoon = allMovies.slice(16, 20);
 
  return (
    <div className="home-figma">
      {/* Main Hero - The Witcher Style */}
      {heroMovie && (
        <section 
          className="hero-banner-figma"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${heroMovie.backdrop_path})`
          }}
        >
          <div className="hero-gradient"></div>
          <div className="hero-content-figma">
            <span className="hero-year">{heroMovie.release_date?.split('-')[0]}</span>
            <h1 className="hero-title">{heroMovie.title}</h1>
            <p className="hero-genre">Science Fiction • Drama • Action</p>
            <p className="hero-description">{heroMovie.overview}</p>
            <div className="hero-rating">
              <div className="stars-container">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill={i < 4 ? "#ffd700" : "#666"}>
                    <path d="M10 1l2.5 6.5H19l-5.5 4 2 6.5L10 14l-5.5 4 2-6.5L1 7.5h6.5z"/>
                  </svg>
                ))}
              </div>
            </div>
            <div className="hero-buttons">
              <Link to="/movies" className="btn-watch-figma">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Watch Trailer
              </Link>
              <Link to="/meetups" className="btn-meetup-figma">Find Movie Geeks</Link>
            </div>
          </div>
          <div className="hero-poster">
            <img 
              src={`https://image.tmdb.org/t/p/w500${heroMovie.poster_path}`}
              alt={heroMovie.title}
            />
          </div>
        </section>
      )}

      {/* Featured Movies */}
      <section className="movie-section-figma">
        <div className="section-header-figma">
          <h2>Featured Movie</h2>
          <Link to="/movies" className="see-more-figma">See more ›</Link>
        </div>
        <div className="movie-grid-figma">
          {featuredMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      </section>

      {/* New Arrival */}
      <section className="movie-section-figma">
        <div className="section-header-figma">
          <h2>New Arrival</h2>
          <Link to="/movies" className="see-more-figma">See more ›</Link>
        </div>
        <div className="movie-grid-figma">
          {newArrivals.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      </section>

      {/* Secondary Hero - John Wick Style */}
      {secondHero && (
        <section 
          className="hero-banner-secondary"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${secondHero.backdrop_path})`
          }}
        >
          <div className="hero-gradient"></div>
          <div className="hero-content-figma">
            <span className="hero-year">{secondHero.release_date?.split('-')[0]}</span>
            <h2 className="hero-title-secondary">{secondHero.title}</h2>
            <p className="hero-genre">Science Fiction • Drama • Action</p>
            <p className="hero-description">{secondHero.overview?.slice(0, 200)}...</p>
            <div className="hero-rating">
              <div className="stars-container">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill={i < 4 ? "#ffd700" : "#666"}>
                    <path d="M10 1l2.5 6.5H19l-5.5 4 2 6.5L10 14l-5.5 4 2-6.5L1 7.5h6.5z"/>
                  </svg>
                ))}
              </div>
            </div>
            <div className="hero-buttons">
              <Link to="/movies" className="btn-watch-figma">Watch Trailer</Link>
              <Link to="/meetups" className="btn-meetup-figma">Find Movie Geeks</Link>
            </div>
          </div>
          <div className="hero-poster">
            <img 
              src={`https://image.tmdb.org/t/p/w500${secondHero.poster_path}`}
              alt={secondHero.title}
            />
          </div>
        </section>
      )}

      {/* Exclusive Trailers */}
      <section className="movie-section-figma">
        <div className="section-header-figma">
          <h2>Exclusive Trailers</h2>
          <Link to="/movies" className="see-more-figma">See more ›</Link>
        </div>
        <div className="trailer-carousel-wrapper">
          {trailerStartIndex > 0 && (
            <button
              type="button"
              className="trailer-arrow trailer-arrow-left"
              onClick={() =>
                setTrailerStartIndex((prev) => Math.max(0, prev - EXCLUSIVE_TRAILERS_VISIBLE))
              }
            >
              ‹
            </button>
          )}
          <div className="trailer-grid-figma">
            {newArrivals
              .slice(trailerStartIndex, trailerStartIndex + EXCLUSIVE_TRAILERS_VISIBLE)
              .map((movie) => {
                const trailer = trailers[movie.id];
                const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;

                return (
                  <div key={movie.id} className="trailer-card-figma">
                    {trailerUrl ? (
                      <a
                        href={trailerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="trailer-link"
                      >
                        <div className="trailer-thumbnail">
                          <img
                            src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
                            alt={movie.title}
                          />
                          <div className="play-overlay">
                            <svg width="60" height="60" viewBox="0 0 60 60" fill="rgba(255,255,255,0.9)">
                              <circle cx="30" cy="30" r="28" fill="rgba(0,0,0,0.6)" />
                              <path d="M24 18l18 12-18 12z" fill="white" />
                            </svg>
                          </div>
                        </div>
                        <h4>{movie.title}</h4>
                      </a>
                    ) : (
                      <div>
                        <div className="trailer-thumbnail">
                          <img
                            src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
                            alt={movie.title}
                          />
                          <div className="play-overlay">
                            <svg width="60" height="60" viewBox="0 0 60 60" fill="rgba(255,255,255,0.9)">
                              <circle cx="30" cy="30" r="28" fill="rgba(0,0,0,0.6)" />
                              <path d="M24 18l18 12-18 12z" fill="white" />
                            </svg>
                          </div>
                        </div>
                        <h4>{movie.title}</h4>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
          {trailerStartIndex + EXCLUSIVE_TRAILERS_VISIBLE < newArrivals.length && (
            <button
              type="button"
              className="trailer-arrow trailer-arrow-right"
              onClick={() =>
                setTrailerStartIndex((prev) =>
                  Math.min(
                    Math.max(0, newArrivals.length - EXCLUSIVE_TRAILERS_VISIBLE),
                    prev + EXCLUSIVE_TRAILERS_VISIBLE
                  )
                )
              }
            >
              ›
            </button>
          )}
        </div>
      </section>

      {/* Trending */}
      <section className="movie-section-figma">
        <div className="section-header-figma">
          <h2>Trending</h2>
          <Link to="/movies" className="see-more-figma">See more ›</Link>
        </div>
        <div className="trending-scroll">
          {trending.map((movie) => {
            const hasVoteAverage = typeof movie.vote_average === 'number';
            const rating = hasVoteAverage ? movie.vote_average.toFixed(1) : null;
            const genreLabel = formatGenresFromIds(movie.genre_ids);

            return (
              <Link
                key={movie.id}
                to={`/movies/${movie.id}`}
                className="trending-card-figma"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                  alt={movie.title}
                />
                <h4 className="trending-title">{movie.title}</h4>
                <div className="trending-info">
                  {rating && (
                    <span className="trending-rating">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        fill="#ffa500"
                      >
                        <path d="M10 1l2.5 6.5H19l-5.5 4 2 6.5L10 14l-5.5 4 2-6.5L1 7.5h6.5z" />
                      </svg>
                      {rating}
                    </span>
                  )}
                  {genreLabel && (
                    <span className="trending-genre">{genreLabel}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Third Hero - Mission Impossible Style */}
      {thirdHero && (
        <section 
          className="hero-banner-secondary"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${thirdHero.backdrop_path})`
          }}
        >
          <div className="hero-gradient"></div>
          <div className="hero-content-figma">
            <h2 className="hero-title-secondary">{thirdHero.title}</h2>
            <p className="hero-genre">Action • Thriller</p>
            <p className="hero-description">{thirdHero.overview?.slice(0, 200)}...</p>
            <div className="hero-rating">
              <div className="stars-container">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill={i < 4 ? "#ffd700" : "#666"}>
                    <path d="M10 1l2.5 6.5H19l-5.5 4 2 6.5L10 14l-5.5 4 2-6.5L1 7.5h6.5z"/>
                  </svg>
                ))}
              </div>
            </div>
            <div className="hero-buttons">
              <Link to="/movies" className="btn-watch-figma">Watch Trailer</Link>
              <Link to="/meetups" className="btn-meetup-figma">Find Movie Geeks</Link>
            </div>
          </div>
          <div className="hero-poster">
            <img 
              src={`https://image.tmdb.org/t/p/w500${thirdHero.poster_path}`}
              alt={thirdHero.title}
            />
          </div>
        </section>
      )}

      {/* Most Popular */}
      <section className="movie-section-figma most-popular-section">
        <div className="section-header-figma">
          <h2>Most popular</h2>
          <Link to="/movies" className="see-more-figma">See more ›</Link>
        </div>
        <div className="movie-grid-figma most-popular-grid">
          {mostPopular.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      </section>

      {/* Coming Soon */}
      <section className="movie-section-figma coming-soon-section">
        <div className="section-header-figma">
          <h2>Coming soon</h2>
          <Link to="/movies" className="see-more-figma">See more ›</Link>
        </div>
        <div className="movie-grid-figma coming-soon-grid">
          {comingSoon.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      </section>
    </div>
  );
};

export default HomeFigma;
