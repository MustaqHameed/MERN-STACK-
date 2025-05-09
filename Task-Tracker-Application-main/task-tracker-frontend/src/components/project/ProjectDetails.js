import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import TaskForm from '../tasks/TaskForm';
import '../styles/ProjectDetails.css';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  const [editingTask, setEditingTask] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState('');
  const [editedTaskDescription, setEditedTaskDescription] = useState('');
  const [editedTaskStatus, setEditedTaskStatus] = useState('');

  const [showTaskForm, setShowTaskForm] = useState(false);

  // Memoizing fetchTasks to prevent unnecessary re-creations on each render
  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/tasks/${projectId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [projectId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        setProject(projectRes.data);
        await fetchTasks();
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Project not found or failed to load.');
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId, fetchTasks]); // Add fetchTasks in the dependency array

  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter((task) => task.status === 'Completed').length;
    return (completedTasks / tasks.length) * 100;
  };

  const handleAddTask = () => {
    localStorage.setItem('currentProjectId', projectId);
    setShowTaskForm(true);
  };

  const handleDeleteProject = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this project?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      navigate('/projects');
    } catch (err) {
      console.error(err);
      alert('Failed to delete project');
    }
  };

  const handleEditClick = () => {
    setEditedTitle(project.title);
    setEditedDescription(project.description);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/projects/${projectId}`,
        { title: editedTitle, description: editedDescription },
        { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
      );
      setProject(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('Failed to update project');
    }
  };

  const handleTaskEditClick = (task) => {
    setEditingTask(task);
    setEditedTaskTitle(task.title);
    setEditedTaskDescription(task.description);
    setEditedTaskStatus(task.status);
  };

  const handleTaskCancelEdit = () => {
    setEditingTask(null);
  };

  const handleTaskSaveEdit = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/tasks/${editingTask._id}`,
        {
          title: editedTaskTitle,
          description: editedTaskDescription,
          status: editedTaskStatus,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
      );

      setTasks(tasks.map((task) =>
        task._id === editingTask._id ? response.data : task
      ));
      setEditingTask(null);
    } catch (err) {
      console.error(err);
      alert('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/tasks/${taskId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
      );
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete task');
    }
  };

  if (loading) return <div className="loader">Loading...</div>;

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button className="create-project-btn" onClick={() => navigate('/projects/add')}>
          Create New Project
        </button>
      </div>
    );
  }

  const taskCounts = {
    pending: tasks.filter((task) => task.status === 'Pending').length,
    inProgress: tasks.filter((task) => task.status === 'In Progress').length,
    completed: tasks.filter((task) => task.status === 'Completed').length,
  };

  return (
    <div className="project-details-container">
      <div className="project-task-wrapper">
        <div className="project-card-combined">
          <div className="details-card">
            <h2>{project.title}</h2>
            <p>{project.description || 'No description available.'}</p>
            <p><strong>Created:</strong> {new Date(project.createdAt).toLocaleString()}</p>
            <p><strong>Last Updated:</strong> {new Date(project.updatedAt).toLocaleString()}</p>
          </div>

          <div className="project-actions">
            <button className="edit-btn" onClick={handleEditClick}>Edit Project</button>
            <button className="delete-btn" onClick={handleDeleteProject}>Delete Project</button>
          </div>

          <div className="progress-bar-section">
            <p>Project Progress</p>
            <div className="progress-bar-background">
              <div
                className="progress-bar-fill"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
            <p>{Math.round(calculateProgress())}% Complete</p>
          </div>
        </div>

        <div className="task-section">
          <h3>Tasks</h3>
          <div className="task-status-summary">
            <p>Pending: {taskCounts.pending}</p>
            <p>In Progress: {taskCounts.inProgress}</p>
            <p>Completed: {taskCounts.completed}</p>
          </div>

          <button onClick={handleAddTask} className="add-task-btn">Add New Task</button>

          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task._id} className="task-item">
                <div className="task-header">
                  <strong>{task.title}</strong> - {task.status}
                </div>
                <p className="task-description">{task.description}</p>
                <p><strong>Created:</strong> {new Date(task.createdAt).toLocaleString()}</p>
                <p><strong>Updated:</strong> {new Date(task.updatedAt).toLocaleString()}</p>
                {task.status === 'Completed' && task.completedAt && (
                  <p><strong>Completed:</strong> {new Date(task.completedAt).toLocaleString()}</p>
                )}
                <div className="task-actions">
                  <button className="delete-btn" onClick={() => handleDeleteTask(task._id)}>Delete</button>
                  <button className="edit-btn" onClick={() => handleTaskEditClick(task)}>Edit</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isEditing && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h3>Edit Project</h3>
            <label htmlFor="project-title">Title</label>
            <input
              id="project-title"
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="edit-input"
            />
            <label htmlFor="project-description">Description</label>
            <textarea
              id="project-description"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="edit-textarea"
            />
            <div className="modal-btn-group">
              <button onClick={handleSaveEdit} className="save-btn">Save</button>
              <button onClick={handleCancelEdit} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editingTask && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h3>Edit Task</h3>
            <label htmlFor="task-title">Title</label>
            <input
              id="task-title"
              type="text"
              value={editedTaskTitle}
              onChange={(e) => setEditedTaskTitle(e.target.value)}
              className="edit-input"
            />
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              value={editedTaskDescription}
              onChange={(e) => setEditedTaskDescription(e.target.value)}
              className="edit-textarea"
            />
            <label htmlFor="task-status">Status</label>
            <select
              id="task-status"
              value={editedTaskStatus}
              onChange={(e) => setEditedTaskStatus(e.target.value)}
              className="status-select"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <div className="modal-btn-group">
              <button onClick={handleTaskSaveEdit} className="save-btn">Save</button>
              <button onClick={handleTaskCancelEdit} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showTaskForm && (
        <div className="popup-overlay">
          <div className="popup-form">
            <TaskForm
              onClose={() => setShowTaskForm(false)}
              onSuccess={() => {
                fetchTasks();
                setShowTaskForm(false);
              }}
            />
          </div>
        </div>
      )}

      <Outlet />
    </div>
  );
};

export default ProjectDetails;
