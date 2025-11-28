import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { meetupAPI, authAPI } from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [myMeetups, setMyMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMeetup, setEditingMeetup] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPastMeetups, setShowPastMeetups] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    movie_name: '',
    meetup_datetime: '',
    location: '',
    description: '',
    max_participants: 10
  });
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    bio: '',
    location: '',
    birth_date: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [profileErrors, setProfileErrors] = useState({});

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

  const handleEditProfile = () => {
    setProfileData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      bio: user?.profile?.bio || '',
      location: user?.profile?.location || '',
      birth_date: user?.profile?.birth_date || ''
    });
    setShowProfileModal(true);
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    if (profileErrors[name]) {
      setProfileErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileErrors({});

    try {
      await authAPI.updateProfile(profileData);
      // Refresh user data in context
      await refreshUser();
      setShowProfileModal(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.data) {
        setProfileErrors(error.response.data);
      }
    }
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setProfileErrors({});
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

  const [activeTab, setActiveTab] = useState('upcoming');

  const getInitials = () => {
    const name = user?.first_name || user?.username || 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      <div className="dashboard-linkedin">
        {/* Left Sidebar - Profile */}
        <aside className="dashboard-left">
          <div className="profile-card">
            <div className="profile-banner"></div>
            <div className="profile-avatar">{getInitials()}</div>
            <h2 className="profile-name">{user?.first_name || user?.username || 'Admin User'}</h2>
            <p className="profile-bio">{user?.profile?.bio || 'Movie Enthusiast'}</p>
            <p className="profile-location">{user?.profile?.location || 'Add your location'}</p>
            
            <div className="profile-stats">
              <div className="profile-stat-row">
                <span className="stat-label">Profile viewers</span>
                <span className="stat-value">126</span>
              </div>
              <div className="profile-stat-row">
                <span className="stat-label">Connections</span>
                <span className="stat-value stat-value-blue">47</span>
              </div>
            </div>
            
            <button className="btn-profile" onClick={handleEditProfile}>Edit Profile</button>
          </div>
          
          <div className="quick-links-card">
            <h3 className="quick-links-title">Quick Links</h3>
            <ul className="quick-links-list">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
                Saved Meetups
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                My Connections
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                Settings
              </li>
            </ul>
          </div>
        </aside>

        {/* Center Content */}
        <main className="dashboard-center">
          {/* Stats Row */}
          <div className="stats-row">
            <div className="stat-box">
              <svg className="stat-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <div className="stat-box-content">
                <div className="stat-box-value">24</div>
                <div className="stat-box-label">Meetups Attended</div>
                <div className="stat-box-change">+3 this month</div>
              </div>
            </div>
            <div className="stat-box">
              <svg className="stat-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
                <line x1="7" y1="2" x2="7" y2="22"/>
                <line x1="17" y1="2" x2="17" y2="22"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
              </svg>
              <div className="stat-box-content">
                <div className="stat-box-value">18</div>
                <div className="stat-box-label">Movies Watched</div>
                <div className="stat-box-change">+5 this month</div>
              </div>
            </div>
            <div className="stat-box">
              <svg className="stat-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <div className="stat-box-content">
                <div className="stat-box-value">47</div>
                <div className="stat-box-label">Connections Made</div>
                <div className="stat-box-change">+8 this month</div>
              </div>
            </div>
            <div className="stat-box">
              <svg className="stat-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
              <div className="stat-box-content">
                <div className="stat-box-value">126</div>
                <div className="stat-box-label">Profile Views</div>
                <div className="stat-box-change">+12 this week</div>
              </div>
            </div>
          </div>

          {/* Meetups Section */}
          <div className="meetups-section">
            <div className="meetups-tabs">
              <button 
                className={`meetup-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming
              </button>
              <button 
                className={`meetup-tab ${activeTab === 'hosting' ? 'active' : ''}`}
                onClick={() => setActiveTab('hosting')}
              >
                Hosting
              </button>
              <button 
                className={`meetup-tab ${activeTab === 'past' ? 'active' : ''}`}
                onClick={() => setActiveTab('past')}
              >
                Past
              </button>
            </div>

            <div className="meetups-list">
              {loading ? (
                <div className="loading-state">Loading...</div>
              ) : (
                <>
                  {activeTab === 'upcoming' && (
                    upcomingMeetups.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-state-icon">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
                            <line x1="7" y1="2" x2="7" y2="22"/>
                            <line x1="17" y1="2" x2="17" y2="22"/>
                            <line x1="2" y1="12" x2="22" y2="12"/>
                          </svg>
                        </div>
                        <h3 className="empty-state-title">No upcoming meetups</h3>
                        <p className="empty-state-text">Your upcoming meetups will appear here</p>
                        <button className="btn-browse-meetups">Browse Meetups</button>
                      </div>
                    ) : (
                      upcomingMeetups.map(meetup => (
                    <div key={meetup.id} className="meetup-item">
                      <div className="meetup-icon">🎬</div>
                      <div className="meetup-content">
                        <div className="meetup-header-row">
                          <div>
                            <h3 className="meetup-title">{meetup.title}</h3>
                            <p className="meetup-movie">{meetup.movie?.title || 'The Conjuring (2013)'}</p>
                          </div>
                          <span className="meetup-badge">Horror</span>
                        </div>
                        <div className="meetup-details">
                          <span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                              <line x1="16" y1="2" x2="16" y2="6"/>
                              <line x1="8" y1="2" x2="8" y2="6"/>
                              <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            {formatDateTime(meetup.meetup_datetime)}
                          </span>
                          <span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                              <circle cx="12" cy="10" r="3"/>
                            </svg>
                            {meetup.location}
                          </span>
                        </div>
                        <div className="meetup-footer">
                          <div className="meetup-host">
                            <div className="host-avatar">S</div>
                            <span>Hosted by <strong>Sarah M.</strong></span>
                          </div>
                          <div className="meetup-attendance">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                              <circle cx="9" cy="7" r="4"/>
                            </svg>
                            {meetup.participants_count || 8}/{meetup.max_participants || 12} attending
                          </div>
                        </div>
                      </div>
                      <button className="meetup-menu">⋯</button>
                    </div>
                      ))
                    )
                  )}
                  {activeTab === 'hosting' && (
                    myMeetups.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-state-icon">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
                            <line x1="7" y1="2" x2="7" y2="22"/>
                            <line x1="17" y1="2" x2="17" y2="22"/>
                            <line x1="2" y1="12" x2="22" y2="12"/>
                          </svg>
                        </div>
                        <h3 className="empty-state-title">No hosting meetups</h3>
                        <p className="empty-state-text">Meetups you're hosting will appear here</p>
                        <button className="btn-browse-meetups">Browse Meetups</button>
                      </div>
                    ) : (
                      myMeetups.map(meetup => (
                    <div key={meetup.id} className="meetup-item">
                      <div className="meetup-icon">🎬</div>
                      <div className="meetup-content">
                        <div className="meetup-header-row">
                          <div>
                            <h3 className="meetup-title">{meetup.title}</h3>
                            <p className="meetup-movie">{meetup.movie?.title || 'Movie Title'}</p>
                          </div>
                        </div>
                        <div className="meetup-details">
                          <span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                              <line x1="16" y1="2" x2="16" y2="6"/>
                              <line x1="8" y1="2" x2="8" y2="6"/>
                              <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            {formatDateTime(meetup.meetup_datetime)}
                          </span>
                          <span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                              <circle cx="12" cy="10" r="3"/>
                            </svg>
                            {meetup.location}
                          </span>
                        </div>
                      </div>
                      <button className="meetup-menu">⋯</button>
                    </div>
                      ))
                    )
                  )}
                  {activeTab === 'past' && (
                    pastMeetups.length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-state-icon">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
                            <line x1="7" y1="2" x2="7" y2="22"/>
                            <line x1="17" y1="2" x2="17" y2="22"/>
                            <line x1="2" y1="12" x2="22" y2="12"/>
                          </svg>
                        </div>
                        <h3 className="empty-state-title">No past meetups</h3>
                        <p className="empty-state-text">Your completed meetups will appear here</p>
                        <button className="btn-browse-meetups">Browse Meetups</button>
                      </div>
                    ) : (
                      pastMeetups.map(meetup => (
                    <div key={meetup.id} className="meetup-item">
                      <div className="meetup-icon">🎬</div>
                      <div className="meetup-content">
                        <div className="meetup-header-row">
                          <div>
                            <h3 className="meetup-title">{meetup.title}</h3>
                            <p className="meetup-movie">{meetup.movie?.title || 'Movie Title'}</p>
                          </div>
                        </div>
                        <div className="meetup-details">
                          <span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                              <line x1="16" y1="2" x2="16" y2="6"/>
                              <line x1="8" y1="2" x2="8" y2="6"/>
                              <line x1="3" y1="10" x2="21" y2="10"/>
                            </svg>
                            {formatDateTime(meetup.meetup_datetime)}
                          </span>
                          <span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                              <circle cx="12" cy="10" r="3"/>
                            </svg>
                            {meetup.location}
                          </span>
                        </div>
                      </div>
                      <button className="meetup-menu">⋯</button>
                    </div>
                      ))
                    )
                  )}
                </>
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="dashboard-right">
          <div className="suggestions-card">
            <div className="suggestions-header">
              <h3>People you may know</h3>
              <button className="link-view-all">View all</button>
            </div>
            <div className="suggestions-list">
              <div className="suggestion-item">
                <div className="suggestion-avatar">M</div>
                <div className="suggestion-info">
                  <h4>Michael T.</h4>
                  <p>Film Lover</p>
                </div>
                <button className="btn-connect">Connect</button>
              </div>
              <div className="suggestion-item">
                <div className="suggestion-avatar">L</div>
                <div className="suggestion-info">
                  <h4>Laura S.</h4>
                  <p>Film Lover</p>
                </div>
                <button className="btn-connect">Connect</button>
              </div>
              <div className="suggestion-item">
                <div className="suggestion-avatar">D</div>
                <div className="suggestion-info">
                  <h4>David C.</h4>
                  <p>Film Lover</p>
                </div>
                <button className="btn-connect">Connect</button>
              </div>
            </div>
          </div>
          
          <div className="trending-card">
            <h3>Trending movies</h3>
            <ul className="trending-list">
              <li>• Oppenheimer</li>
              <li>• Barbie</li>
              <li>• Dune: Part Two</li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={closeProfileModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Profile</h2>
              <button onClick={closeProfileModal} className="modal-close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleProfileSubmit} className="modal-form">
              {/* Profile Photo Section */}
              <div className="profile-photo-section">
                <div className="profile-photo-avatar">
                  {getInitials()}
                  <div className="profile-photo-camera">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                  </div>
                </div>
                <div className="profile-photo-info">
                  <h4>Profile Photo</h4>
                  <p>Upload a new profile photo</p>
                  <button type="button" className="btn-change-photo">Change Photo</button>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name" className="form-label-modal">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={profileData.first_name}
                    onChange={handleProfileInputChange}
                    className={`form-input-modal ${profileErrors.first_name ? 'input-error' : ''}`}
                    placeholder="John"
                  />
                  {profileErrors.first_name && <span className="error-message">{profileErrors.first_name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="last_name" className="form-label-modal">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={profileData.last_name}
                    onChange={handleProfileInputChange}
                    className={`form-input-modal ${profileErrors.last_name ? 'input-error' : ''}`}
                    placeholder="Doe"
                  />
                  {profileErrors.last_name && <span className="error-message">{profileErrors.last_name}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label-modal">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileInputChange}
                  className={`form-input-modal ${profileErrors.email ? 'input-error' : ''}`}
                  placeholder="john@example.com"
                />
                {profileErrors.email && <span className="error-message">{profileErrors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="location" className="form-label-modal">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={profileData.location}
                  onChange={handleProfileInputChange}
                  className={`form-input-modal ${profileErrors.location ? 'input-error' : ''}`}
                  placeholder="Edinburgh, Scotland"
                />
                {profileErrors.location && <span className="error-message">{profileErrors.location}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="birth_date" className="form-label-modal">
                  Birth Date
                </label>
                <input
                  type="date"
                  id="birth_date"
                  name="birth_date"
                  value={profileData.birth_date}
                  onChange={handleProfileInputChange}
                  className={`form-input-modal ${profileErrors.birth_date ? 'input-error' : ''}`}
                />
                {profileErrors.birth_date && <span className="error-message">{profileErrors.birth_date}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="bio" className="form-label-modal">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleProfileInputChange}
                  className={`form-textarea-modal ${profileErrors.bio ? 'input-error' : ''}`}
                  rows="4"
                  placeholder="Tell us about yourself..."
                />
                {profileErrors.bio && <span className="error-message">{profileErrors.bio}</span>}
                {!profileErrors.bio && <span className="form-hint">Brief description for your profile</span>}
              </div>

              <div className="modal-footer">
                <button type="button" onClick={closeProfileModal} className="btn-modal-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
