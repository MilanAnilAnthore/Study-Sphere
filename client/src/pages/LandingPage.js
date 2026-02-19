import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div className="landing-content">
        <h1 className="landing-title">Study Sphere</h1>
        <p className="landing-subtitle">
          Find your perfect study buddy. Connect with students who share your academic interests.
        </p>
        
        <div className="landing-buttons">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/register')}
          >
            Sign Up
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/login')}
          >
            Log In
          </button>
        </div>
      </div>

      <div className="landing-features">
        <div className="feature">
          <span className="feature-icon">🎓</span>
          <h3>Academic Matching</h3>
          <p>Get matched with students in your field of study</p>
        </div>
        <div className="feature">
          <span className="feature-icon">🤝</span>
          <h3>AI-Powered</h3>
          <p>Smart algorithms find your best study partners</p>
        </div>
        <div className="feature">
          <span className="feature-icon">📚</span>
          <h3>21+ Universities</h3>
          <p>Connect with students across Canadian campuses</p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
