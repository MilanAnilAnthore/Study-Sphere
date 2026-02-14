import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';

function App() {

  // Create a state to track what the user is typing
  const [input, setInput] = useState("");
  // Create a state to hold the to-do
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    sex: "",
    major: "",
    school: "",
    country: "",
    city: "",
    province: ""
  });
// 2. A single function to handle ALL input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,    // Keep all the existing fields
      [name]: value   // Update only the one that changed
    });
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
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: 'auto' }}>
        <h2>Enter your information</h2>
        
        {/* We use the "name" property to match the keys in our state object */}
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="age" placeholder="Age" type="number" onChange={handleChange} />
        <input name="sex" placeholder="Sex" onChange={handleChange} />
        <input name="major" placeholder="Major" onChange={handleChange} />
        <input name="school" placeholder="School" onChange={handleChange} />
        <input name="country" placeholder="Country" onChange={handleChange} />
        <input name="city" placeholder="City" onChange={handleChange} />
        <input name="province" placeholder="Province" onChange={handleChange} />

        <button type="submit">Find Study Buddy</button>
      </form>
    </div>
  );
}

export default App;