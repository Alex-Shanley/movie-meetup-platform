import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

        {DUMMY_MEETUPS.length > 0 ? (
          <>
            <div className="meetup-grid">
              {DUMMY_MEETUPS.map((meetup) => {
                const posterUrl = meetup.movie?.poster_url || FALLBACK_STILL;

                return (
                  <div key={meetup.id} className="meetup-card">
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
    </div>
  );
};

export default Meetups;
