import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const API_BASE = 'http://localhost:5000/api';

function RegisterPage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    year: '',
    sex: '',
    school: '',
    academicArea: '',
    major: ''
  });

  const [colleges, setColleges] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch colleges and faculties on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [collegesRes, facultiesRes] = await Promise.all([
          fetch(`${API_BASE}/colleges`),
          fetch(`${API_BASE}/faculties`)
        ]);
        
        const collegesData = await collegesRes.json();
        const facultiesData = await facultiesRes.json();
        
        setColleges(collegesData);
        setFaculties(facultiesData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load form data. Please refresh the page.');
      }
    };
    
    fetchData();
  }, []);

  // Fetch majors when faculty changes
  useEffect(() => {
    if (formData.academicArea) {
      setLoading(true);
      fetch(`${API_BASE}/faculties/${encodeURIComponent(formData.academicArea)}/majors`)
        .then(res => res.json())
        .then(data => {
          setMajors(data || []);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching majors:', err);
          setMajors([]);
          setLoading(false);
        });
    } else {
      setMajors([]);
    }
  }, [formData.academicArea]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'academicArea') {
      setFormData({
        ...formData,
        [name]: value,
        major: '' // Clear major when faculty changes
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data and navigate to dashboard
        localStorage.setItem('userId', data._id);
        localStorage.setItem('userName', data.name);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register">
      <div className="register-container">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
        
        <h1 className="register-title">Create Account</h1>
        <p className="register-subtitle">Join Study Sphere and find your study partners</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                min="16"
                max="100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="year">Year</label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year</option>
                <option value="6">6th+ Year</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="sex">Gender</label>
              <select
                id="sex"
                name="sex"
                value={formData.sex}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="school">College/University</label>
            <select
              id="school"
              name="school"
              value={formData.school}
              onChange={handleChange}
              required
            >
              <option value="">Select your college</option>
              {colleges.map(college => (
                <option key={college._id} value={college.name}>
                  {college.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="academicArea">Faculty / Academic Area</label>
            <select
              id="academicArea"
              name="academicArea"
              value={formData.academicArea}
              onChange={handleChange}
              required
            >
              <option value="">Select academic area</option>
              {faculties.map(faculty => (
                <option key={faculty._id} value={faculty.name}>
                  {faculty.name}
                </option>
              ))}
            </select>
          </div>

          {formData.academicArea && (
            <div className="form-group">
              <label htmlFor="major">Major</label>
              <select
                id="major"
                name="major"
                value={formData.major}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">
                  {loading ? 'Loading majors...' : 'Select your major'}
                </option>
                {majors.map(major => (
                  <option key={major} value={major}>
                    {major}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={submitting}
          >
            {submitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <span onClick={() => navigate('/login')}>Log in</span>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
