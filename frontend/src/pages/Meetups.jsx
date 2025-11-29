import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { meetupAPI } from '../services/api';
import '../styles/HomeFigma.css';

const MEETUP_IMG_1 = '/meetups/meetup-movie-image-1.png';
const MEETUP_IMG_2 = '/meetups/meetup-movie-image-2.png';
const MEETUP_IMG_3 = '/meetups/meetup-movie-image-3.png';
const MEETUP_IMG_4 = '/meetups/meetup-movie-image-4.png';
const MEETUP_IMG_5 = '/meetups/meetup-movie-image-5.png';
const MEETUP_IMG_6 = '/meetups/meetup-movie-image-6.png';
const MEETUP_IMG_7 = '/meetups/meetup-movie-image-7.png';
const MEETUP_IMG_8 = '/meetups/meetup-movie-image-8.png';
const MEETUP_IMG_9 = '/meetups/meetup-movie-image-9.png';
const MEETUP_IMG_10 = '/meetups/meetup-movie-image-10.png';
const MEETUP_IMG_11 = '/meetups/meetup-movie-image-11.png';
const MEETUP_IMG_12 = '/meetups/meetup-movie-image-12.png';
const MEETUP_IMG_13 = '/meetups/meetup-movie-image-13.png';

const FALLBACK_STILL = MEETUP_IMG_13;

const DUMMY_MEETUPS = [
  {
    id: 1,
    title: 'Interstellar Star-Gaze',
    meetup_datetime: '2025-12-12T19:15:00Z',
    organizer: { username: 'Space Explorers' },
    participants_count: 31,
    movie: {
      title: 'Interstellar',
      poster_url: MEETUP_IMG_1,
    },
  },
  {
    id: 2,
    title: 'Inception: Mind-Bend Night',
    meetup_datetime: '2025-12-19T20:00:00Z',
    organizer: { username: 'Dream Architects' },
    participants_count: 29,
    movie: {
      title: 'Inception',
      poster_url: MEETUP_IMG_2,
    },
  },
  {
    id: 3,
    title: 'Dunkirk Shores Meetup',
    meetup_datetime: '2025-12-26T18:30:00Z',
    organizer: { username: 'History Buffs' },
    participants_count: 33,
    movie: {
      title: 'Dunkirk',
      poster_url: MEETUP_IMG_3,
    },
  },
  {
    id: 4,
    title: 'The Dark Knight Gotham Night',
    meetup_datetime: '2026-01-02T21:00:00Z',
    organizer: { username: 'Gotham Crew' },
    participants_count: 27,
    movie: {
      title: 'The Dark Knight',
      poster_url: MEETUP_IMG_4,
    },
  },
  {
    id: 5,
    title: 'Tenet Time-Loop Watch',
    meetup_datetime: '2026-01-09T19:15:00Z',
    organizer: { username: 'Temporal Agents' },
    participants_count: 30,
    movie: {
      title: 'Tenet',
      poster_url: MEETUP_IMG_5,
    },
  },
  {
    id: 6,
    title: 'Mad Max Fury Road Marathon',
    meetup_datetime: '2026-01-16T17:30:00Z',
    organizer: { username: 'Wasteland Racers' },
    participants_count: 26,
    movie: {
      title: 'Mad Max: Fury Road',
      poster_url: MEETUP_IMG_6,
    },
  },
  {
    id: 7,
    title: 'Interstellar Science Meetup',
    meetup_datetime: '2026-01-23T19:15:00Z',
    organizer: { username: 'Space Explorers' },
    participants_count: 32,
    movie: {
      title: 'Interstellar',
      poster_url: MEETUP_IMG_7,
    },
  },
  {
    id: 8,
    title: 'Inception Late-Night Talk',
    meetup_datetime: '2026-01-30T22:30:00Z',
    organizer: { username: 'Dream Architects' },
    participants_count: 28,
    movie: {
      title: 'Inception',
      poster_url: MEETUP_IMG_8,
    },
  },
  {
    id: 9,
    title: 'Dunkirk Veterans Screening',
    meetup_datetime: '2026-02-06T18:00:00Z',
    organizer: { username: 'History Buffs' },
    participants_count: 35,
    movie: {
      title: 'Dunkirk',
      poster_url: MEETUP_IMG_9,
    },
  },
  {
    id: 10,
    title: 'The Dark Knight Cosplay Night',
    meetup_datetime: '2026-02-13T20:15:00Z',
    organizer: { username: 'Cape & Cowl' },
    participants_count: 31,
    movie: {
      title: 'The Dark Knight',
      poster_url: MEETUP_IMG_10,
    },
  },
  {
    id: 11,
    title: 'Tenet Backwards Watch Party',
    meetup_datetime: '2026-02-20T19:00:00Z',
    organizer: { username: 'Entropy Squad' },
    participants_count: 29,
    movie: {
      title: 'Tenet',
      poster_url: MEETUP_IMG_11,
    },
  },
  {
    id: 12,
    title: 'Mad Max Car Meet & Movie',
    meetup_datetime: '2026-02-27T15:30:00Z',
    organizer: { username: 'V8 Interceptors' },
    participants_count: 34,
    movie: {
      title: 'Mad Max: Fury Road',
      poster_url: MEETUP_IMG_12,
    },
  },
];

const Meetups = () => {
  const [filter, setFilter] = useState('all');
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMeetup, setSelectedMeetup] = useState(null);

  useEffect(() => {
    fetchMeetups();
  }, []);

  const fetchMeetups = async () => {
    try {
      const response = await meetupAPI.getAll();
      const realMeetups = response.data.results || response.data || [];
      setMeetups(realMeetups);
    } catch (error) {
      console.error('Error fetching meetups:', error);
      setMeetups([]);
    } finally {
      setLoading(false);
    }
  };

  const formatMeetupDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  };

  return (
    <div className="meetups-page">
      <section className="meetups-hero">
        <div className="meetups-hero-overlay" />
        <div className="meetups-hero-content">
          <h1 className="meetups-hero-title">
            Discover Movie<span>Geeks</span>
          </h1>
          <p className="meetups-hero-subtitle">
            Find your next favourite film with advanced filters and search
          </p>
        </div>
      </section>

      <section className="meetups-section">
        <div className="section-header-figma meetups-section-header">
          <h2>Movie meet ups</h2>
          <div className="filter-tabs">
            <Link
              to="/meetups/create"
              className="btn btn-primary meetups-section-create"
            >
              Create meetup
            </Link>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
            Loading meetups...
          </div>
        ) : meetups.length > 0 ? (
          <>
            <div className="meetup-grid">
              {meetups.map((meetup) => {
                const posterUrl = meetup.movie?.poster_url || FALLBACK_STILL;

                return (
                  <div 
                    key={meetup.id} 
                    className="meetup-card"
                    onClick={() => setSelectedMeetup(meetup)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="meetup-card-poster">
                      <img
                        src={posterUrl}
                        alt={meetup.movie?.title || meetup.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = FALLBACK_STILL;
                        }}
                      />
                    </div>
                    <div className="meetup-card-body">
                      <div className="meetup-card-date">
                        {formatMeetupDate(meetup.meetup_datetime)} GMT
                      </div>
                      <h3 className="meetup-card-title">{meetup.title}</h3>
                      <div className="meetup-card-organizer">By {meetup.organizer?.username}</div>
                      <div className="meetup-card-attendees-row">
                        <span className="meetup-card-attendees-text">
                          {meetup.participants_count} attendees
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="meetups-see-more-wrapper">
              <button type="button" className="btn btn-primary meetups-see-more">
                See more
              </button>
            </div>
          </>
        ) : (
          <p>No meetups found.</p>
        )}
      </section>

      {selectedMeetup && (
        <div className="modal-overlay" onClick={() => setSelectedMeetup(null)}>
          <div className="rsvp-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="rsvp-modal-header">
              <h2 className="rsvp-modal-title">Movie Meetup RSVP</h2>
              <button onClick={() => setSelectedMeetup(null)} className="rsvp-modal-close">
                ✕
              </button>
            </div>
            
            <div className="rsvp-modal-body">
              <div className="rsvp-info-grid">
                <div className="rsvp-info-card">
                  <div className="rsvp-info-icon">🎬</div>
                  <div className="rsvp-info-label">MOVIE</div>
                  <div className="rsvp-info-value">{selectedMeetup.movie?.title || selectedMeetup.title}</div>
                </div>
                
                <div className="rsvp-info-card">
                  <div className="rsvp-info-icon">👥</div>
                  <div className="rsvp-info-label">ATTENDEES</div>
                  <div className="rsvp-info-value-blue">
                    {selectedMeetup.participants_count}/{selectedMeetup.max_participants || 10} attending
                  </div>
                </div>
                
                <div className="rsvp-info-card">
                  <div className="rsvp-info-icon">📅</div>
                  <div className="rsvp-info-label">DATE & TIME</div>
                  <div className="rsvp-info-value">{formatMeetupDate(selectedMeetup.meetup_datetime)} GMT</div>
                </div>
                
                <div className="rsvp-info-card">
                  <div className="rsvp-info-icon">📍</div>
                  <div className="rsvp-info-label">LOCATION</div>
                  <div className="rsvp-info-value">{selectedMeetup.location || 'TBD'}</div>
                </div>
              </div>
              
              <div className="rsvp-organizer-card">
                <div className="rsvp-organizer-avatar">
                  {selectedMeetup.organizer?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="rsvp-organizer-label">Organized by</div>
                  <div className="rsvp-organizer-name">{selectedMeetup.organizer?.username}</div>
                </div>
              </div>
              
              {selectedMeetup.description && (
                <div className="rsvp-description-card">
                  <div className="rsvp-description-header">📝 Description/Notes</div>
                  <div className="rsvp-description-text">{selectedMeetup.description}</div>
                </div>
              )}
              
              <div className="rsvp-form-section">
                <div className="rsvp-form-header">🎟️ RSVP for This Event</div>
                
                <div className="rsvp-form-group">
                  <label className="rsvp-form-label">Your Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your full name" 
                    className="rsvp-form-input"
                  />
                </div>
                
                <div className="rsvp-form-group">
                  <label className="rsvp-form-label">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="your.email@example.com" 
                    className="rsvp-form-input"
                  />
                </div>
                
                <div className="rsvp-form-group">
                  <label className="rsvp-form-label">Will you attend?</label>
                  <div className="rsvp-attendance-buttons">
                    <button type="button" className="rsvp-attendance-btn">✓ Yes</button>
                    <button type="button" className="rsvp-attendance-btn">✗ No</button>
                    <button type="button" className="rsvp-attendance-btn">? Maybe</button>
                  </div>
                </div>
                
                <div className="rsvp-form-footer">
                  <button type="button" onClick={() => setSelectedMeetup(null)} className="rsvp-cancel-btn">
                    Cancel
                  </button>
                  <button type="button" className="rsvp-submit-btn">
                    Submit RSVP
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Meetups;
