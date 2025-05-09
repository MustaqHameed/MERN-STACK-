import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/SignupForm.css';

const countryOptions = [
  { value: 'India', label: 'India' },
  { value: 'United States', label: 'United States' },
  { value: 'Canada', label: 'Canada' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Australia', label: 'Australia' },
  { value: 'France', label: 'France' },
  { value: 'Other', label: 'Other' }
];

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    country: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { name, email, password, country } = formData;
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e?.target?.name) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    } else {
      setFormData({ ...formData, country: e.value });
    }
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !country) {
      return setError('All fields are required');
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/register`, formData);
      setMessage(res.data.message || 'Registration successful! Redirecting to login...');
      setFormData({ name: '', email: '', password: '', country: '' });

      // Redirect to login after 1.5 seconds
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="signup-container">
      <h2>Create your account</h2>
      <h4>Start organizing your tasks and projects</h4>
      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handleChange}
        />
        <Select
          name="country"
          options={countryOptions}
          value={countryOptions.find(option => option.value === country)}
          onChange={handleChange}
          placeholder="Select Country"
          isSearchable
        />
        <button type="submit">Register</button>

        <p className="redirect-login">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
