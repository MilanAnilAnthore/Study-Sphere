import React, { useState } from 'react';
import './App.css';
 
const schools = [
  "Carleton University", "Concordia University", "Dalhousie University", 
  "McGill University", "McMaster University", "Memorial University", 
  "Queen's University", "Simon Fraser University", "University of Alberta", 
  "University of British Columbia", "University of Calgary", "University of Guelph", 
  "University of Manitoba", "University of Montreal", "University of Ottawa", 
  "University of Saskatchewan", "University of Toronto", "University of Victoria", 
  "University of Waterloo", "Western University", "York University"
].sort();
 
const academicAreas = {
  "Business, Management, and Commerce": [
    "Accounting", "Business Administration", "Commerce", "Finance", "Management", "Marketing"
  ],
  "Engineering and Applied Sciences": [
    "Chemical Engineering", "Civil Engineering", "Computer Engineering", 
    "Electrical Engineering", "Mechanical Engineering", "Software Engineering"
  ],
  "Health and Life Sciences": [
    "Biochemistry", "Biology", "Health Sciences", "Kinesiology", "Nursing"
  ],
  "Data, Math, and Physical Sciences": [
    "Chemistry", "Computer Science", "Data Science", "Mathematics", "Physics", "Statistics"
  ],
  "Social Sciences and Education": [
    "Economics", "Education", "Political Science", "Psychology", "Sociology"
  ],
  "Humanities, Arts, and Law": [
    "Architecture", "English Literature", "Fine Arts", "History", "Law", "Philosophy"
  ]
};
function App() {
 
  // Create a state to track what the user is typing
  // const [input, setInput] = useState("");
  // Create a state to hold the to-do
  const [formData, setFormData] = useState({
    name: "",
    year: "",
    sex: "Not specified",
    major: "",
    school: "",
 
  });
// 2. A single function to handle ALL input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
 
    if (name === "academicArea") {
      // When the Area changes, we MUST clear the Major
      setFormData({
        ...formData,
        [name]: value,
        major: "" // <--- This is the key change
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the page from refreshing
 
    const response = await fetch('http://localhost:3000', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData), // Sends the whole object at once
    });
 
    if (response.ok) {
      alert("Entry Submitted!");
    }
  };
 
  return (
<div className="App">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '450px', margin: 'auto', padding: '30px' }}>
        <h2>Find a Study Buddy</h2>
 
        <input name="name" placeholder="Full Name" onChange={handleChange} required />
 
        <div style={{ display: 'flex', gap: '10px' }}>
          <input name="age" placeholder="Age" type="number" onChange={handleChange} style={{ flex: 1 }} />
          <select name="sex" value={formData.sex} onChange={handleChange} style={{ flex: 1 }}>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="Not specified">Other/Private</option>
          </select>
        </div>
 
        <label>School</label>
        <select name="school" value={formData.school} onChange={handleChange} required>
          <option value="">Select School</option>
          {schools.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
 
        {/* --- FIRST DROPDOWN: Academic Area --- */}
        <label>Academic Area</label>
        <select name="academicArea" value={formData.academicArea} onChange={handleChange} required>
          <option value="">Select an Area</option>
          {Object.keys(academicAreas).map(area => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
 
        {/* --- SECOND DROPDOWN: Specific Major (Conditional) --- */}
        {formData.academicArea && (
          <>
            <label>Specific Major</label>
            <select name="major" value={formData.major} onChange={handleChange} required>
              <option value="">Select Major</option>
              {academicAreas[formData.academicArea].map(m => (
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
