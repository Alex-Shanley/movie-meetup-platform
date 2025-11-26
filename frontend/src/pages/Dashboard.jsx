import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { meetupAPI } from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [myMeetups, setMyMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMeetup, setEditingMeetup] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPastMeetups, setShowPastMeetups] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    movie_name: '',
    meetup_datetime: '',
    location: '',
    description: '',
    max_participants: 10
  });
  const [formErrors, setFormErrors] = useState({});

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

  const now = new Date();
  const upcomingMeetups = myMeetups.filter(m => new Date(m.meetup_datetime) >= now);
  const pastMeetups = myMeetups.filter(m => new Date(m.meetup_datetime) < now);

  const handleEditClick = (meetup) => {
    setEditingMeetup(meetup);
    setFormData({
      title: meetup.title,
      movie_name: meetup.movie?.title || '',
      meetup_datetime: meetup.meetup_datetime.slice(0, 16),
      location: meetup.location,
      description: meetup.description || '',
      max_participants: meetup.max_participants
    });
  };

  const handleCreateClick = () => {
    setShowCreateModal(true);
    setFormData({
      title: '',
      movie_name: '',
      meetup_datetime: '',
      location: '',
      description: '',
      max_participants: 10
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.meetup_datetime) errors.meetup_datetime = 'Date and time are required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (new Date(formData.meetup_datetime) < new Date()) {
      errors.meetup_datetime = 'Date must be in the future';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingMeetup) {
        await meetupAPI.update(editingMeetup.id, formData);
        setEditingMeetup(null);
      } else {
        await meetupAPI.create(formData);
        setShowCreateModal(false);
      }
      await fetchMyMeetups();
    } catch (error) {
      console.error('Error saving meetup:', error);
      if (error.response?.data) {
        setFormErrors(error.response.data);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this meetup?')) return;
    try {
      await meetupAPI.delete(id);
      await fetchMyMeetups();
    } catch (error) {
      console.error('Error deleting meetup:', error);
    }
  };

  const closeModal = () => {
    setEditingMeetup(null);
    setShowCreateModal(false);
    setFormErrors({});
  };

  const formatDateTime = (datetime) => {
    return new Date(datetime).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="dashboard-modern">
        {/* Header */}
        <header className="dashboard-header">
          <div className="dashboard-header-content">
            <div className="dashboard-greeting">
              <h1 className="dashboard-title">Welcome back, {user?.first_name || user?.username}!</h1>
              <p className="dashboard-subtitle">Bring Movies to Life</p>
            </div>
            <div className="dashboard-actions">
              <Link to="/profile" className="btn-icon" title="Profile Settings">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </Link>
              <button onClick={logout} className="btn-icon" title="Logout">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Overview Stats */}
        <section className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon stat-icon-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{myMeetups.length}</div>
              <div className="stat-label">Total Meetups</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{upcomingMeetups.length}</div>
              <div className="stat-label">Upcoming</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-muted">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div className="stat-content">
              <div className="stat-value">{pastMeetups.length}</div>
              <div className="stat-label">Past Meetups</div>
            </div>
          </div>
        </section>

        {/* Create Meetup Button */}
        <div className="dashboard-cta">
          <button onClick={handleCreateClick} className="btn-create-meetup">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span>Create New Meetup</span>
          </button>
        </div>

        {/* Upcoming Meetups */}
        <section className="dashboard-section">
          <div className="section-header-modern">
            <h2 className="section-title">Upcoming Meetups</h2>
            {upcomingMeetups.length > 0 && (
              <span className="badge-count">{upcomingMeetups.length}</span>
            )}
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your meetups...</p>
            </div>
          ) : upcomingMeetups.length > 0 ? (
            <div className="meetups-grid">
              {upcomingMeetups.map(meetup => (
                <div key={meetup.id} className="meetup-card-modern">
                  <div className="meetup-card-header">
                    <h3 className="meetup-card-title">{meetup.title}</h3>
                    <div className="meetup-card-actions">
                      <button 
                        onClick={() => handleEditClick(meetup)} 
                        className="btn-card-action"
                        title="Edit"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(meetup.id)} 
                        className="btn-card-action btn-card-action-danger"
                        title="Delete"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  {meetup.movie?.title && (
                    <div className="meetup-card-movie">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
                        <line x1="7" y1="2" x2="7" y2="22"/>
                        <line x1="17" y1="2" x2="17" y2="22"/>
                        <line x1="2" y1="12" x2="22" y2="12"/>
                        <line x1="2" y1="7" x2="7" y2="7"/>
                        <line x1="2" y1="17" x2="7" y2="17"/>
                        <line x1="17" y1="17" x2="22" y2="17"/>
                        <line x1="17" y1="7" x2="22" y2="7"/>
                      </svg>
                      <span>{meetup.movie.title}</span>
                    </div>
                  )}
                  <div className="meetup-card-info">
                    <div className="info-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span>{formatDateTime(meetup.meetup_datetime)}</span>
                    </div>
                    <div className="info-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span>{meetup.location}</span>
                    </div>
                    {meetup.max_participants && (
                      <div className="info-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        <span>{meetup.participants_count || 0}/{meetup.max_participants}</span>
                      </div>
                    )}
                  </div>
                  <Link to={`/meetups/${meetup.id}`} className="btn-view-details">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <h3>No upcoming meetups</h3>
              <p>Create your first meetup to start bringing movies to life!</p>
            </div>
          )}
        </section>

        {/* Past Meetups */}
        {pastMeetups.length > 0 && (
          <section className="dashboard-section">
            <div className="section-header-modern">
              <button 
                onClick={() => setShowPastMeetups(!showPastMeetups)} 
                className="section-toggle"
              >
                <h2 className="section-title">Past Meetups</h2>
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className={showPastMeetups ? 'rotate-180' : ''}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              <span className="badge-count badge-muted">{pastMeetups.length}</span>
            </div>

            {showPastMeetups && (
              <div className="meetups-grid">
                {pastMeetups.map(meetup => (
                  <div key={meetup.id} className="meetup-card-modern meetup-card-past">
                    <div className="meetup-card-header">
                      <h3 className="meetup-card-title">{meetup.title}</h3>
                    </div>
                    {meetup.movie?.title && (
                      <div className="meetup-card-movie">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
                          <line x1="7" y1="2" x2="7" y2="22"/>
                          <line x1="17" y1="2" x2="17" y2="22"/>
                          <line x1="2" y1="12" x2="22" y2="12"/>
                        </svg>
                        <span>{meetup.movie.title}</span>
                      </div>
                    )}
                    <div className="meetup-card-info">
                      <div className="info-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        <span>{formatDateTime(meetup.meetup_datetime)}</span>
                      </div>
                      <div className="info-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        <span>{meetup.location}</span>
                      </div>
                    </div>
                    <Link to={`/meetups/${meetup.id}`} className="btn-view-details">
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      {/* Edit/Create Modal */}
      {(editingMeetup || showCreateModal) && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingMeetup ? 'Edit Meetup' : 'Create New Meetup'}
              </h2>
              <button onClick={closeModal} className="modal-close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="title" className="form-label-modal">
                  Meetup Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`form-input-modal ${formErrors.title ? 'input-error' : ''}`}
                  placeholder="e.g., Inception Watch Party"
                />
                {formErrors.title && <span className="error-message">{formErrors.title}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="movie_name" className="form-label-modal">
                  Movie Being Watched
                </label>
                <input
                  type="text"
                  id="movie_name"
                  name="movie_name"
                  value={formData.movie_name}
                  onChange={handleInputChange}
                  className="form-input-modal"
                  placeholder="e.g., Inception"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="meetup_datetime" className="form-label-modal">
                    Date & Time <span className="required">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    id="meetup_datetime"
                    name="meetup_datetime"
                    value={formData.meetup_datetime}
                    onChange={handleInputChange}
                    className={`form-input-modal ${formErrors.meetup_datetime ? 'input-error' : ''}`}
                  />
                  {formErrors.meetup_datetime && <span className="error-message">{formErrors.meetup_datetime}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="max_participants" className="form-label-modal">
                    Max Participants
                  </label>
                  <input
                    type="number"
                    id="max_participants"
                    name="max_participants"
                    value={formData.max_participants}
                    onChange={handleInputChange}
                    className="form-input-modal"
                    min="1"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="location" className="form-label-modal">
                  Location <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`form-input-modal ${formErrors.location ? 'input-error' : ''}`}
                  placeholder="e.g., AMC Theater, Times Square"
                />
                {formErrors.location && <span className="error-message">{formErrors.location}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label-modal">
                  Description/Notes
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-textarea-modal"
                  rows="4"
                  placeholder="Add any additional details about the meetup..."
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn-modal-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit">
                  {editingMeetup ? 'Save Changes' : 'Create Meetup'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
