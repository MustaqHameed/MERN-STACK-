import React, { useState } from 'react';
import axios from 'axios';
import '../styles/TaskForm.css';

const TaskForm = ({ onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [completedAt, setCompletedAt] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const projectId = localStorage.getItem('currentProjectId');
    const user = JSON.parse(localStorage.getItem('user')); // Parse the user object

    const userId = user?.id; // Get the userId from the parsed user object

    // Debug log for checking if userId is being retrieved correctly
    console.log('User ID from localStorage:', userId); 

    if (!title.trim()) {
      setError('Task title is required');
      setIsSubmitting(false);
      return;
    }
    if (!projectId) {
      setError('Project ID missing');
      setIsSubmitting(false);
      return;
    }
    if (!userId) {
      setError('User ID missing');
      setIsSubmitting(false);
      return;
    }

    const newTask = {
      title,
      description,
      status,
      projectId,
      createdBy: userId,  // Include the userId as createdBy
      completedAt: completedAt || undefined,
    };

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No auth token found');
        setIsSubmitting(false);
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/tasks',
        newTask,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        onSuccess && onSuccess(); // ✅ use onSuccess prop correctly
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-form">
        <h2>Create Task</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Task Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="edit-input"
          />

          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="edit-textarea"
          />

          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="status-select"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <label>Completion Date (Optional)</label>
          <input
            type="date"
            value={completedAt}
            onChange={(e) => setCompletedAt(e.target.value)}
            className="edit-input"
          />

          <div className="modal-btn-group">
            <button
              type="submit"
              className="save-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
