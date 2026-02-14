import React, { useState, useEffect } from 'react';
import './App.css';

const faculties = [
  "Business, Management, and Commerce",
  "Engineering and Applied Sciences",
  "Health and Life Sciences",
  "Data, Math, and Physical Sciences",
  "Social Sciences and Education",
  "Humanities, Arts, and Law"
];

const schools = [
  "Carleton University", "Concordia University", "Dalhousie University",
  "McGill University", "McMaster University", "Memorial University",
  "Queen's University", "Simon Fraser University", "University of Alberta",
  "University of British Columbia", "University of Calgary", "University of Guelph",
  "University of Manitoba", "University of Montreal", "University of Ottawa",
  "University of Saskatchewan", "University of Toronto", "University of Victoria",
  "University of Waterloo", "Western University", "York University"
].sort();

function App() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    year: "",
    sex: "Prefer not to say",
    major: "",
    school: "",
    academicArea: ""
  });

  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch majors when faculty changes
  useEffect(() => {
    if (formData.academicArea) {
      setLoading(true);
      fetch(`http://localhost:5000/api/faculties/${encodeURIComponent(formData.academicArea)}/majors`)
        .then(res => res.json())
        .then(data => {
          setMajors(data || []);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching majors:", err);
          setLoading(false);
        });
    } else {
      setMajors([]);
    }
  }, [formData.academicArea]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "academicArea") {
      setFormData({
        ...formData,
        [name]: value,
        major: "" // Clear major when faculty changes
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:5000/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      alert("User registered successfully!");
    } else {
      alert(`Error: ${data.message}`);
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '450px', margin: 'auto', padding: '30px' }}>
        <h2>Find a Study Buddy</h2>

        <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />

        <input name="age" type="number" placeholder="Age (optional)" value={formData.age} onChange={handleChange} min="1" max="100" />

        <div style={{ display: 'flex', gap: '10px' }}>
          <select name="year" value={formData.year} onChange={handleChange} style={{ flex: 1 }}>
            <option value="">Year</option>
            <option value="1">1st</option>
            <option value="2">2nd</option>
            <option value="3">3rd</option>
            <option value="4">4th</option>
            <option value="5">5th</option>
            <option value="6">6th+</option>
          </select>
          <select name="sex" value={formData.sex} onChange={handleChange} style={{ flex: 1 }}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        <label>School</label>
        <select name="school" value={formData.school} onChange={handleChange} required>
          <option value="">Select School</option>
          {schools.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <label>Academic Area</label>
        <select name="academicArea" value={formData.academicArea} onChange={handleChange} required>
          <option value="">Select an Academic Area</option>
          {faculties.map(faculty => (
            <option key={faculty} value={faculty}>{faculty}</option>
          ))}
        </select>

        {formData.academicArea && (
          <>
            <label>Major</label>
            <select name="major" value={formData.major} onChange={handleChange} required disabled={loading}>
              <option value="">{loading ? "Loading majors..." : "Select Major"}</option>
              {majors.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </>
        )}

        <button type="submit" style={{ background: '#28a745', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
          Start Matching
        </button>
      </form>
    </div>
  );
}

export default App;