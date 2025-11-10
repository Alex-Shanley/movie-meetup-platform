import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to Movie Meetup Platform</h1>
        <p>Discover movies, connect with fellow movie lovers, and organize meetups to watch films together!</p>
        <div className="hero-buttons">
          <Link to="/movies" className="btn btn-primary">Browse Movies</Link>
          <Link to="/meetups" className="btn btn-secondary">Find Meetups</Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>Discover Movies</h3>
          <p>Browse popular movies, search our database, and rate your favorites</p>
        </div>
        <div className="feature-card">
          <h3>Create Meetups</h3>
          <p>Organize movie watching sessions at your favorite theaters</p>
        </div>
        <div className="feature-card">
          <h3>Connect with Others</h3>
          <p>Join meetups, meet new people who share your passion for cinema</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
