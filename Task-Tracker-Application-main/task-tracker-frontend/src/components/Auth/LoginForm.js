import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/LoginForm.css';

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return setError('Both fields are required');
    }
  
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, formData);
      const { token, user } = res.data;
  
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
  
      setMessage('Login successful');
      setFormData({ email: '', password: '' });
  
      if (onLogin) {
        onLogin(token); // ✅ pass token to App.js
      }
  
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };
  

  return (
    <div className="login-container">
      <h2>Welcome back</h2>
      <h4>Login to access your tasks and projects</h4>
      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSubmit} className="login-form">
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
        <button type="submit">Login</button>
      </form>

      <p className="redirect-signup">
        Don't have an account? <Link to="/signup">Create an account</Link>
      </p>
    </div>
  );
};

export default LoginForm;
