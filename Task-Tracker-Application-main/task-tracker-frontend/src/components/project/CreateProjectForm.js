import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateProjectForm.css';

const CreateProjectForm = () => {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [popupMessage, setPopupMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { title, description } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Only clear error messages on input change, not success
    if (popupMessage.type === 'error') {
      setPopupMessage({ type: '', text: '' });
    }
  };

  const showPopup = (type, text) => {
    setPopupMessage({ type, text });

    // Don't auto-clear success message if we're redirecting
    if (type !== 'success') {
      setTimeout(() => setPopupMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!title) {
      showPopup('error', 'Title must be required');
      return;
    }
  
    try {
      setIsLoading(true);
  
      // Step 1: Fetch existing projects
      const token = localStorage.getItem('authToken');
      const projectRes = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/projects`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      // Step 2: Check if user already has 4 projects
      if (projectRes.data.length >= 4) {
        showPopup('error', 'Maximum 4 projects allowed. Redirecting...');
        setTimeout(() => navigate('/projects'), 2500);
        return;
      }
  
      // Step 3: Create project if under the limit
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/projects`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 201) {
        showPopup('success', 'Project created successfully');
        setFormData({ title: '', description: '' });
  
        setTimeout(() => navigate('/projects'), 2500);
      }
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message ||
        (err.request ? 'Network error. Please try again later.' : 'An unexpected error occurred.');
      showPopup('error', message);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="create-project-form">
      <h2>Create a New Project</h2>

      {popupMessage.text && (
        <div className={`popup-message ${popupMessage.type}`}>
          {popupMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            name="title"
            value={title}
            onChange={handleChange}
            placeholder="Enter project title"
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleChange}
            placeholder="Enter project description"
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Project...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
};

export default CreateProjectForm;
