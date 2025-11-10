import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { meetupAPI } from '../services/api';

const MeetupDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [meetup, setMeetup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    fetchMeetupDetails();
  }, [id]);

  const fetchMeetupDetails = async () => {
    try {
      const response = await meetupAPI.getOne(id);
      setMeetup(response.data);
    } catch (error) {
      console.error('Error fetching meetup:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    try {
      await meetupAPI.join(id, message);
      fetchMeetupDetails();
      setMessage('');
      alert('Successfully joined the meetup!');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to join meetup');
    }
  };

  const handleLeave = async () => {
    if (window.confirm('Are you sure you want to leave this meetup?')) {
      try {
        await meetupAPI.leave(id);
        fetchMeetupDetails();
        alert('Successfully left the meetup');
      } catch (error) {
        alert('Failed to leave meetup');
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    try {
      await meetupAPI.addComment(id, commentText);
      fetchMeetupDetails();
      setCommentText('');
    } catch (error) {
      alert('Failed to add comment');
    }
  };

  const isParticipant = () => {
    return meetup?.participants?.some(p => p.user.id === user?.id);
  };

  const isOrganizer = () => {
    return meetup?.organizer?.id === user?.id;
  };

  if (loading) return <div>Loading...</div>;
  if (!meetup) return <div>Meetup not found</div>;

  return (
    <div className="meetup-detail">
      <div className="meetup-detail-header">
        <h1>{meetup.title}</h1>
        {meetup.is_full && <span className="badge-full">FULL</span>}
      </div>

      <div className="meetup-detail-content">
        <section className="meetup-info">
          <h2>Details</h2>
          <p><strong>Movie:</strong> {meetup.movie?.title}</p>
          <p><strong>Location:</strong> {meetup.location}</p>
          {meetup.theater_name && <p><strong>Theater:</strong> {meetup.theater_name}</p>}
          <p><strong>Date & Time:</strong> {new Date(meetup.meetup_datetime).toLocaleString()}</p>
          <p><strong>Participants:</strong> {meetup.participants_count}/{meetup.max_participants}</p>
          <p><strong>Organizer:</strong> {meetup.organizer?.username}</p>
          <p><strong>Description:</strong> {meetup.description}</p>
        </section>

        {isAuthenticated && !isOrganizer() && (
          <section className="meetup-actions">
            {!isParticipant() && !meetup.is_full ? (
              <div>
                <textarea
                  placeholder="Optional message to organizer..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="message-input"
                />
                <button onClick={handleJoin} className="btn btn-primary">Join Meetup</button>
              </div>
            ) : isParticipant() ? (
              <button onClick={handleLeave} className="btn btn-danger">Leave Meetup</button>
            ) : null}
          </section>
        )}

        <section className="meetup-participants">
          <h2>Participants ({meetup.participants?.length || 0})</h2>
          <ul>
            <li key={meetup.organizer.id}>
              <strong>{meetup.organizer.username}</strong> (Organizer)
            </li>
            {meetup.participants?.map(participant => (
              <li key={participant.id}>
                {participant.user.username}
                {participant.message && <span className="participant-message"> - {participant.message}</span>}
              </li>
            ))}
          </ul>
        </section>

        <section className="meetup-comments">
          <h2>Comments</h2>
          {isAuthenticated && (
            <form onSubmit={handleAddComment} className="comment-form">
              <textarea
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">Post Comment</button>
            </form>
          )}
          <div className="comments-list">
            {meetup.comments?.map(comment => (
              <div key={comment.id} className="comment">
                <strong>{comment.user.username}</strong>
                <p>{comment.text}</p>
                <span className="comment-date">{new Date(comment.created_at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MeetupDetail;
