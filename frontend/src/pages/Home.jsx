import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieAPI } from '../services/api';

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
    <Link to={`/movies/${movie.id}`} className="movie-card-new">
      <div className="movie-poster-new">
        <img 
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
      </div>
      <div className="movie-info-new">
        <h4>{movie.title}</h4>
        <div className="movie-meta-new">
          {hasVoteAverage && (
            <span className="rating">
              <svg width="12" height="12" viewBox="0 0 20 20" fill="#FFD700">
                <path d="M10 1l2.5 6.5H19l-5.5 4 2 6.5L10 14l-5.5 4 2-6.5L1 7.5h6.5z"/>
              </svg>
              {`IMDb ${imdbScore} / 100`}
            </span>
          )}
          {genreLabel && <span className="genre">{genreLabel}</span>}
        </div>
      </div>
      <div className="showtimes-new">
        {DEFAULT_SHOWTIMES.map((time) => (
          <span key={time} className="showtime-badge">{time}</span>
        ))}
      </div>
    </Link>
  );
};

const Home = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [trending, setTrending] = useState([]);
  const [mostPopular, setMostPopular] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await movieAPI.getPopular(1);
      const movies = response.data.results || [];
      
      setFeaturedMovies(movies.slice(0, 4));
      setNewArrivals(movies.slice(4, 8));
      setTrending(movies.slice(8, 12));

      // Build Most popular without Jujutsu Kaisen (its wide artwork breaks the grid)
      const mostPopularClean = movies
        .slice(12, 20)
        .filter((movie) => !movie.title?.toLowerCase().includes('jujutsu'))
        .slice(0, 4);
      setMostPopular(mostPopularClean);

      setComingSoon(movies.slice(16, 20));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const mainHero = featuredMovies[0];

  return (
    <div className="home-new">
      {/* Main Hero Banner */}
      {mainHero && (
        <section className="hero-main" style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8) 20%, transparent 80%), url(https://image.tmdb.org/t/p/original${mainHero.backdrop_path})`
        }}>
          <div className="container-new">
            <div className="hero-text">
              <span className="hero-year-new">{mainHero.release_date?.split('-')[0]}</span>
              <h1 className="hero-title-new">{mainHero.title}</h1>
              <p className="hero-genre">Science Fiction • Drama • Action</p>
              <p className="hero-desc">{mainHero.overview?.slice(0, 150)}...</p>
              <div className="hero-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="#FFD700">
                      <path d="M10 1l2.5 6.5H19l-5.5 4 2 6.5L10 14l-5.5 4 2-6.5L1 7.5h6.5z"/>
                    </svg>
                  ))}
                </div>
              </div>
              <div className="hero-actions">
                <Link to="/movies" className="btn-primary-new">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Watch
                </Link>
                <Link to="/meetups" className="btn-secondary-new">Find Movie Geeks</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Movies */}
      <section className="section-new">
        <div className="container-new">
          <div className="section-header-new">
            <h2>Featured Movie</h2>
            <Link to="/movies" className="see-more">See more ›</Link>
          </div>
          <div className="movie-grid-new">
            {featuredMovies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        </div>
      </section>

      {/* New Arrival */}
      <section className="section-new">
        <div className="container-new">
          <div className="section-header-new">
            <h2>New Arrival</h2>
            <Link to="/movies" className="see-more">See more ›</Link>
          </div>
          <div className="movie-grid-new">
            {newArrivals.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        </div>
      </section>

      {/* Secondary Hero Banner */}
      {featuredMovies[1] && (
        <section className="hero-secondary" style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8) 20%, transparent 80%), url(https://image.tmdb.org/t/p/original${featuredMovies[1].backdrop_path})`
        }}>
          <div className="container-new">
            <div className="hero-text">
              <span className="hero-year-new">{featuredMovies[1].release_date?.split('-')[0]}</span>
              <h2 className="hero-title-secondary">{featuredMovies[1].title}</h2>
              <p className="hero-genre">Science Fiction • Drama • Action</p>
              <p className="hero-desc">{featuredMovies[1].overview?.slice(0, 150)}...</p>
              <div className="hero-actions">
                <Link to="/movies" className="btn-primary-new">Watch</Link>
                <Link to="/meetups" className="btn-secondary-new">Find Movie Geeks</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trending */}
      <section className="section-new">
        <div className="container-new">
          <div className="section-header-new">
            <h2>Trending</h2>
            <Link to="/movies" className="see-more">See more ›</Link>
          </div>
          <div className="movie-grid-new">
            {trending.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        </div>
      </section>

      {/* Third Hero Banner */}
      {featuredMovies[2] && (
        <section className="hero-secondary" style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.8) 20%, transparent 80%), url(https://image.tmdb.org/t/p/original${featuredMovies[2].backdrop_path})`
        }}>
          <div className="container-new">
            <div className="hero-text">
              <h2 className="hero-title-secondary">{featuredMovies[2].title}</h2>
              <p className="hero-genre">Action • Thriller</p>
              <p className="hero-desc">{featuredMovies[2].overview?.slice(0, 150)}...</p>
              <div className="hero-actions">
                <Link to="/movies" className="btn-primary-new">Watch</Link>
                <Link to="/meetups" className="btn-secondary-new">Find Movie Geeks</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Most Popular */}
      <section className="section-new">
        <div className="container-new">
          <div className="section-header-new">
            <h2>Most popular</h2>
            <Link to="/movies" className="see-more">See more ›</Link>
          </div>
          <div className="movie-grid-new">
            {mostPopular.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="section-new">
        <div className="container-new">
          <div className="section-header-new">
            <h2>Coming soon</h2>
            <Link to="/movies" className="see-more">See more ›</Link>
          </div>
          <div className="movie-grid-new">
            {comingSoon.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
