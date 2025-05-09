import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/TaskList.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [filteredTasks, setFilteredTasks] = useState([]);

  const [editingTask, setEditingTask] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedStatus, setEditedStatus] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.id;

        if (!token || !userId) {
          setError('Unauthorized. Please log in again.');
          setLoading(false);
          return;
        }

        const [taskRes, projectRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/tasks`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { createdBy: userId },
          }),
          axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/projects`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setTasks(taskRes.data);
        setProjects(projectRes.data || []);
        setFilteredTasks(taskRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch tasks or projects.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = tasks;
    if (statusFilter) filtered = filtered.filter((t) => t.status === statusFilter);
    if (projectFilter) filtered = filtered.filter((t) => t.projectId === projectFilter);
    setFilteredTasks(filtered);
  }, [statusFilter, projectFilter, tasks]);

  const handleEditClick = (task) => {
    setEditingTask(task);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedStatus(task.status);
  };

  const handleDelete = async (taskId) => {
    const confirm = window.confirm('Are you sure you want to delete this task?');
    if (!confirm) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete task');
    }
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/tasks/${editingTask._id}`,
        {
          title: editedTitle,
          description: editedDescription,
          status: editedStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const updatedTask = response.data;
      setTasks(tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)));
      setEditingTask(null);
    } catch (err) {
      console.error('Edit failed:', err.response?.data || err.message);
      alert('Failed to update task');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="task-list-container">
      <div className="top-bar">
        <h2>Your Tasks</h2>
        <div className="filters">
          <label className="highlight-label">Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <label className="highlight-label">Project:</label>
          <select value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)}>
            <option value="">All</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        <ul className="task-list">
          {filteredTasks.map((task) => (
            <li key={task._id} className="task-item">
              <h4 className="highlight-label">{task.title}</h4>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
              <p>Project: {projects.find((p) => p._id === task.projectId)?.title || 'Unknown'}</p>
              <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
              <p>Updated: {new Date(task.updatedAt).toLocaleString()}</p>
              {task.completedAt && (
                <p>Completed: {new Date(task.completedAt).toLocaleString()}</p>
              )}
              <div className="task-actions">
                <button onClick={() => handleEditClick(task)}>Edit</button>
                <button onClick={() => handleDelete(task._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editingTask && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h3>Edit Task</h3>
            <label className="highlight-label">Title</label>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <label className="highlight-label">Description</label>
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
            <label className="highlight-label">Status</label>
            <select value={editedStatus} onChange={(e) => setEditedStatus(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <div className="modal-btn-group">
              <button onClick={handleSaveEdit}>Save</button>
              <button onClick={() => setEditingTask(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
