import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { movieAPI, meetupAPI } from '../services/api';
import '../styles/CreateMeetup.css';

const CreateMeetup = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    movie: '',
    location: '',
    theater_name: '',
    meetup_datetime: '',
    max_participants: 10,
  });
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const searchMovies = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await movieAPI.searchTMDB(searchQuery);
      setMovies(response.data.results || []);
    } catch (error) {
      console.error('Error searching movies:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.movie) {
      setError('Please select a movie');
      return;
    }

    try {
      const response = await meetupAPI.create(formData);
      navigate('/meetups');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create meetup');
    }
  };

  return (
    <div className="create-meetup-page">
      <div className="create-meetup-layout">
        <div className="create-meetup-left">
          <span className="create-meetup-kicker">Host a movie meetup</span>
          <h1 className="create-meetup-title">Bring movie geeks together in real life</h1>
          <p className="create-meetup-subtitle">
            Pick a film, choose a cinema or cosy living room, and set your ideal time.
            We’ll help you keep track of who’s coming.
          </p>

          <div className="create-meetup-highlights">
            <div className="create-meetup-highlight">
              <h3>1. Choose a movie</h3>
              <p>Search our TMDB catalogue and lock in the exact title and year.</p>
            </div>
            <div className="create-meetup-highlight">
              <h3>2. Set the vibe</h3>
              <p>Give your meetup a punchy title and short description so people know what to expect.</p>
            </div>
            <div className="create-meetup-highlight">
              <h3>3. Share & fill seats</h3>
              <p>Share the link with friends or the community and track participants in real time.</p>
            </div>
          </div>

          <div className="create-meetup-meta-row">
            <div className="create-meetup-meta-pill">⏱ Under 2 minutes to set up</div>
            <div className="create-meetup-meta-pill">🎬 Powered by TMDB</div>
          </div>
        </div>

        <div className="create-meetup-card">
          {error && <div className="error-message create-meetup-error">{error}</div>}
            <h2 className="create-meetup-card-title">Meetup details</h2>
            <form onSubmit={handleSubmit} className="create-meetup-form">
              <div className="create-meetup-section">
                <h3 className="create-meetup-section-title">Basics</h3>
                <div className="form-group">
                  <label>Meetup Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Friday Night Horror Fest"
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Describe your meetup... what makes it special?"
                  />
                </div>
              </div>

              <div className="create-meetup-section">
                <h3 className="create-meetup-section-title">Movie</h3>
                <div className="form-group">
                  <label>Search Movie *</label>
                  <div className="create-meetup-movie-search">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for a movie title..."
                    />
                    <button
                      type="button"
                      onClick={searchMovies}
                      className="create-meetup-search-button"
                    >
                      Search
                    </button>
                  </div>
                  {movies.length > 0 && (
                    <select
                      name="movie"
                      value={formData.movie}
                      onChange={handleChange}
                      className="create-meetup-movie-select"
                    >
                      <option value="">Select a movie</option>
                      {movies.map((movie) => (
                        <option key={movie.id} value={movie.id}>
                          {movie.title} ({movie.release_date?.substring(0, 4)})
                        </option>
                      ))}
                    </select>
                  )}
                  <p className="create-meetup-hint">Can&apos;t see it yet? Try a shorter title or year.</p>
                </div>
              </div>

              <div className="create-meetup-section">
                <h3 className="create-meetup-section-title">Location</h3>
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="City, Country or neighbourhood"
                  />
                </div>

                <div className="form-group">
                  <label>Theater or Venue Name</label>
                  <input
                    type="text"
                    name="theater_name"
                    value={formData.theater_name}
                    onChange={handleChange}
                    placeholder="Cinema, bar, or living room name (optional)"
                  />
                </div>
              </div>

              <div className="create-meetup-section create-meetup-section-inline">
                <div className="create-meetup-field-half">
                  <h3 className="create-meetup-section-title">Date &amp; time</h3>
                  <div className="form-group">
                    <label>Date &amp; Time *</label>
                    <input
                      type="datetime-local"
                      name="meetup_datetime"
                      value={formData.meetup_datetime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="create-meetup-field-half">
                  <h3 className="create-meetup-section-title">Capacity</h3>
                  <div className="form-group">
                    <label>Max Participants *</label>
                    <input
                      type="number"
                      name="max_participants"
                      value={formData.max_participants}
                      onChange={handleChange}
                      min="2"
                      max="100"
                      required
                    />
                    <p className="create-meetup-hint">You can adjust this later from the meetup page.</p>
                  </div>
                </div>
              </div>

              <button type="submit" className="create-meetup-submit">
                Create meetup
              </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMeetup;
