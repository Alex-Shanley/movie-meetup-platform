import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { meetupAPI } from '../services/api';

const Meetups = () => {
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    fetchMeetups();
  }, [filter]);

  const fetchMeetups = async () => {
    setLoading(true);
    try {
      const params = filter === 'upcoming' ? { upcoming: 'true' } : {};
      const response = await meetupAPI.getAll(params);
      setMeetups(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching meetups:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="meetups-page">
      <div className="page-header">
        <h1>Movie Meetups</h1>
        <Link to="/meetups/create" className="btn btn-primary">Create Meetup</Link>
      </div>

      <div className="filter-buttons">
        <button 
          className={`btn ${filter === 'upcoming' ? 'btn-active' : 'btn-secondary'}`}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={`btn ${filter === 'all' ? 'btn-active' : 'btn-secondary'}`}
          onClick={() => setFilter('all')}
        >
          All Meetups
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : meetups.length > 0 ? (
        <div className="meetup-grid">
          {meetups.map(meetup => (
            <div key={meetup.id} className="meetup-card">
              <h3>{meetup.title}</h3>
              <p className="meetup-movie">🎬 {meetup.movie?.title}</p>
              <p className="meetup-location">📍 {meetup.location}</p>
              <p className="meetup-datetime">📅 {new Date(meetup.meetup_datetime).toLocaleString()}</p>
              <p className="meetup-participants">
                👥 {meetup.participants_count}/{meetup.max_participants}
                {meetup.is_full && <span className="badge-full">FULL</span>}
              </p>
              <p className="meetup-organizer">Organized by {meetup.organizer?.username}</p>
              <Link to={`/meetups/${meetup.id}`} className="btn btn-secondary">View Details</Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No meetups found.</p>
      )}
    </div>
  );
};

export default Meetups;
