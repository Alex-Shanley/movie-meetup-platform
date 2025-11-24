import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieAPI } from '../services/api';
import '../styles/HomeFigma.css';

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

const FILTER_TABS = ['All', 'Action', 'Drama', 'Comedy'];
const FILTER_GENRE_MAP = {
  Action: 28,
  Drama: 18,
  Comedy: 35,
};

const formatGenresFromIds = (genreIds) => {
  if (!Array.isArray(genreIds) || genreIds.length === 0) return null;
  const names = genreIds.map((id) => GENRE_MAP[id]).filter(Boolean);
  if (!names.length) return null;
  return names.slice(0, 3).join(', ');
};

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isPopularMode, setIsPopularMode] = useState(true);

  useEffect(() => {
    fetchPopularMovies(1, false);
  }, []);

  const fetchPopularMovies = async (pageToLoad = 1, append = false) => {
    setLoading(true);
    try {
      const response = await movieAPI.getPopular(pageToLoad);
      const results = response.data.results || [];
      setMovies((prev) => (append ? [...prev, ...results] : results));
      setPage(pageToLoad);
      setIsPopularMode(true);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      // If search is cleared, go back to popular listing
      fetchPopularMovies(1, false);
      return;
    }

    setLoading(true);
    try {
      const response = await movieAPI.searchTMDB(searchQuery);
      setMovies(response.data.results || []);
      setIsPopularMode(false);
      setPage(1);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowMore = () => {
    if (isPopularMode) {
      fetchPopularMovies(page + 1, true);
    } else {
      // In search mode, reset to popular movies when user asks for more
      setSearchQuery('');
      fetchPopularMovies(1, false);
    }
  };

  const handleFilterChange = (tab) => {
    setActiveFilter(tab);
  };

  const filteredMovies = movies.filter((movie) => {
    if (activeFilter === 'All') return true;
    const genreId = FILTER_GENRE_MAP[activeFilter];
    if (!genreId) return true;
    const genreIds = movie.genre_ids || [];
    return Array.isArray(genreIds) && genreIds.includes(genreId);
  });

  const heroMovie = movies[0];
  const heroBackground =
    heroMovie && heroMovie.backdrop_path
      ? { backgroundImage: `url(https://image.tmdb.org/t/p/original${heroMovie.backdrop_path})` }
      : {};
 
  return (
    <div className="movies-page-figma">
      <section className="movies-hero" style={heroBackground}>
        <div className="movies-hero-overlay">
          <div className="movies-hero-content">
            <h1 className="movies-hero-title">Discover movies</h1>
            <p className="movies-hero-subtitle">
              Find your next favourite film with advanced filters and search
            </p>
            <form onSubmit={handleSearch} className="movies-hero-search">
              <input
                type="text"
                placeholder="Search for movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="movies-hero-search-input"
              />
              <button type="submit" className="movies-hero-search-button">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="movie-section-figma">
        <div className="section-header-figma">
          <h2>Now Showing</h2>
          <div className="filter-tabs">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`tab-btn${activeFilter === tab ? ' active' : ''}`}
                onClick={() => handleFilterChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            <div className="movie-grid-figma">
              {filteredMovies.map((movie) => {
                const hasVoteAverage = typeof movie.vote_average === 'number';
                const imdbScore = hasVoteAverage
                  ? (movie.vote_average * 10).toFixed(1)
                  : null;
                const genreLabel = formatGenresFromIds(movie.genre_ids);

                return (
                  <Link
                    key={movie.id}
                    to={`/movies/${movie.id}`}
                    className="movie-card-figma"
                  >
                    <div className="movie-poster-figma">
                      {movie.poster_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                          alt={movie.title}
                        />
                      )}
                    </div>
                    <div className="movie-info-figma">
                      <h4>{movie.title}</h4>
                      <div className="movie-meta-figma">
                        {hasVoteAverage && (
                          <span className="rating-figma">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 20 20"
                              fill="#ffa500"
                            >
                              <path d="M10 1l2.5 6.5H19l-5.5 4 2 6.5L10 14l-5.5 4 2-6.5L1 7.5h6.5z" />
                            </svg>
                            {`IMDb ${imdbScore} / 100`}
                          </span>
                        )}
                        {genreLabel && (
                          <span className="genre-figma">{genreLabel}</span>
                        )}
                      </div>
                      <div className="showtimes-figma">
                        {DEFAULT_SHOWTIMES.map((time, index) => (
                          <span
                            key={time}
                            className={`time${index === 0 ? ' active' : ''}`}
                          >
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {filteredMovies.length === 0 && (
              <p style={{ marginTop: '2rem', color: '#666' }}>
                No movies found. Try a different search or filter.
              </p>
            )}

            {!loading && movies.length > 0 && isPopularMode && (
              <div className="show-more-wrapper">
                <button
                  type="button"
                  className="btn-show-more"
                  onClick={handleShowMore}
                >
                  Show more
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Movies;
