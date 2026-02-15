import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch, removeAuthToken, getAuthToken } from '../config/api';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchLoading, setMatchLoading] = useState(false);
  const [error, setError] = useState('');

  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    const token = getAuthToken();
    if (!token || !userId) {
      navigate('/login');
      return;
    }

    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await authFetch(`/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setError('Failed to load user data');
          if (response.status === 401) {
            navigate('/login');
          }
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, navigate]);

  const findMatches = async () => {
    setMatchLoading(true);
    setError('');

    try {
      const response = await authFetch(`/users/${userId}/match`);
      const data = await response.json();

      if (response.ok) {
        setMatches(Array.isArray(data.matches) ? data.matches : []);
      } else {
        setError(data.message || 'Failed to find matches');
      }
    } catch (err) {
      setError('Failed to connect to matching service');
    } finally {
      setMatchLoading(false);
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="logo">Study Sphere</h1>
        <div className="header-right">
          <span className="user-greeting">Hi, {userName || 'Student'}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {error && <div className="error-banner">{error}</div>}

        {user && (
          <section className="profile-section">
            <h2>Your Profile</h2>
            <div className="profile-card">
              <div className="profile-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="profile-info">
                <h3>{user.name}</h3>
                <p className="profile-detail">
                  <span className="label">Email:</span> {user.email}
                </p>
                <p className="profile-detail">
                  <span className="label">College:</span> {user.college?.name}
                </p>
                <p className="profile-detail">
                  <span className="label">Faculty:</span> {user.faculty?.name}
                </p>
                <p className="profile-detail">
                  <span className="label">Major:</span> {user.major}
                </p>
                {user.year && (
                  <p className="profile-detail">
                    <span className="label">Year:</span> {user.year}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        <section className="matches-section">
          <div className="matches-header">
            <h2>Study Buddy Matches</h2>
            <button
              className="find-btn"
              onClick={findMatches}
              disabled={matchLoading}
            >
              {matchLoading ? 'Finding...' : matches.length ? 'Find Again' : 'Find Matches'}
            </button>
          </div>

          {matchLoading && (
            <div className="match-loading">
              <div className="spinner"></div>
              <p>AI is finding your best study partners...</p>
            </div>
          )}

          {!matchLoading && matches.length === 0 && (
            <div className="no-matches">
              <span className="no-matches-icon">🔍</span>
              <p>Click "Find Matches" to discover study buddies based on your academic profile</p>
            </div>
          )}

          {!matchLoading && matches.length > 0 && (
            <div className="matches-grid">
              {matches.map((match, index) => (
                <div key={index} className="match-card">
                  <div className="match-rank">#{index + 1}</div>
                  <div className="match-avatar">
                    {match.name?.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="match-name">{match.name}</h3>
                  <div className="match-score">
                    <span className="score-value">{match.matchScore}%</span>
                    <span className="score-label">Match</span>
                  </div>
                  <p className="match-reason">{match.reason}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
