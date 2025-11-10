import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { meetupAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [myMeetups, setMyMeetups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyMeetups();
  }, []);

  const fetchMyMeetups = async () => {
    try {
      const response = await meetupAPI.getAll({ my_meetups: 'true' });
      setMyMeetups(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching meetups:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.username}!</h1>
      
      <section className="dashboard-section">
        <div className="section-header">
          <h2>My Organized Meetups</h2>
          <Link to="/meetups/create" className="btn btn-primary">Create New Meetup</Link>
        </div>
        
        {loading ? (
          <p>Loading...</p>
        ) : myMeetups.length > 0 ? (
          <div className="meetup-grid">
            {myMeetups.map(meetup => (
              <div key={meetup.id} className="meetup-card">
                <h3>{meetup.title}</h3>
                <p>{meetup.movie?.title}</p>
                <p>{new Date(meetup.meetup_datetime).toLocaleString()}</p>
                <p>Participants: {meetup.participants_count}/{meetup.max_participants}</p>
                <Link to={`/meetups/${meetup.id}`} className="btn btn-secondary">View Details</Link>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't organized any meetups yet.</p>
        )}
      </section>

      <section className="dashboard-section">
        <h2>Quick Links</h2>
        <div className="quick-links">
          <Link to="/movies" className="quick-link-card">Browse Movies</Link>
          <Link to="/meetups" className="quick-link-card">Find Meetups</Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
