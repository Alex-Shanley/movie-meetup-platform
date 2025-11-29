import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { meetupAPI } from '../services/api';
import '../styles/HomeFigma.css';

// Local meetup images (copied into public/meetups)
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

// Fallback so every card always has an image even if a URL fails
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
      {/* Hero section */}
      <section className="meetups-hero">
        <div className="meetups-hero-overlay" />
        <div className="meetups-hero-content">
          <h1 className="meetups-hero-title">
            Discover Movie<span>Geeks</span>
          </h1>
          <p className="meetups-hero-subtitle">
            Find your next favourite film with advanced filters and search
          </p>
          <div className="meetups-hero-filters">
            <button
              type="button"
              className={`meetups-pill${filter === 'upcoming' ? ' active' : ''}`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </button>
            <button
              type="button"
              className={`meetups-pill${filter === 'all' ? ' active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Meet ups
            </button>
          </div>
        </div>
      </section>

      {/* Meetups grid */}
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
                          // If an image fails to load, fall back to a known-good still
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
                        <div className="meetup-card-avatars">
                          <span className="meetup-avatar avatar-1" />
                          <span className="meetup-avatar avatar-2" />
                          <span className="meetup-avatar avatar-3" />
                        </div>
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

      {/* Meetup Detail Modal */}
      {selectedMeetup && (
        <div className="modal-overlay" onClick={() => setSelectedMeetup(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedMeetup.title}</h2>
              <button onClick={() => setSelectedMeetup(null)} className="modal-close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            
            <div className="modal-form">
              {selectedMeetup.movie?.title && (
                <div className="form-group">
                  <label className="form-label-modal">Movie</label>
                  <div className="form-input-modal" style={{ background: '#f9fafb', cursor: 'default' }}>
                    {selectedMeetup.movie.title}
                  </div>
                </div>
              )}
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label-modal">Date & Time</label>
                  <div className="form-input-modal" style={{ background: '#f9fafb', cursor: 'default' }}>
                    {formatMeetupDate(selectedMeetup.meetup_datetime)}
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label-modal">Attendees</label>
                  <div className="form-input-modal" style={{ background: '#f9fafb', cursor: 'default' }}>
                    {selectedMeetup.participants_count} / {selectedMeetup.max_participants || '∞'}
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label-modal">Location</label>
                <div className="form-input-modal" style={{ background: '#f9fafb', cursor: 'default' }}>
                  {selectedMeetup.location || 'TBD'}
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label-modal">Organized by</label>
                <div className="form-input-modal" style={{ background: '#f9fafb', cursor: 'default' }}>
                  {selectedMeetup.organizer?.username}
                </div>
              </div>
              
              {selectedMeetup.description && (
                <div className="form-group">
                  <label className="form-label-modal">Description/Notes</label>
                  <div className="form-textarea-modal" style={{ background: '#f9fafb', cursor: 'default', minHeight: '100px', padding: '0.75rem' }}>
                    {selectedMeetup.description}
                  </div>
                </div>
              )}
              
              <div className="modal-footer">
                <div className="modal-footer-left"></div>
                <div className="modal-footer-right">
                  <button type="button" onClick={() => setSelectedMeetup(null)} className="btn-modal-cancel">
                    Cancel
                  </button>
                  <button type="button" className="btn-modal-submit">
                    RSVP to Meetup
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
