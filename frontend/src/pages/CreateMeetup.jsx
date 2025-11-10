import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { movieAPI, meetupAPI } from '../services/api';

const CreateMeetup = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    movie: '',
    location: '',
    theater_name: '',
    meetup_datetime: '',
    max_participants: 10
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
      navigate(`/meetups/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create meetup');
    }
  };

  return (
    <div className="create-meetup">
      <h1>Create a Movie Meetup</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="meetup-form">
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
            placeholder="Describe your meetup..."
          />
        </div>

        <div className="form-group">
          <label>Search Movie *</label>
          <div className="movie-search">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a movie..."
            />
            <button type="button" onClick={searchMovies} className="btn btn-secondary">
              Search
            </button>
          </div>
          {movies.length > 0 && (
            <select
              name="movie"
              value={formData.movie}
              onChange={handleChange}
              className="movie-select"
            >
              <option value="">Select a movie</option>
              {movies.map(movie => (
                <option key={movie.id} value={movie.id}>
                  {movie.title} ({movie.release_date?.substring(0, 4)})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label>Location *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="City, State"
          />
        </div>

        <div className="form-group">
          <label>Theater Name</label>
          <input
            type="text"
            name="theater_name"
            value={formData.theater_name}
            onChange={handleChange}
            placeholder="Theater name (optional)"
          />
        </div>

        <div className="form-group">
          <label>Date & Time *</label>
          <input
            type="datetime-local"
            name="meetup_datetime"
            value={formData.meetup_datetime}
            onChange={handleChange}
            required
          />
        </div>

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
        </div>

        <button type="submit" className="btn btn-primary">Create Meetup</button>
      </form>
    </div>
  );
};

export default CreateMeetup;
