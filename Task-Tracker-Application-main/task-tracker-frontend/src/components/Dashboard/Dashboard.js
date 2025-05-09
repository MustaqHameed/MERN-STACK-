import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';


function Dashboard() {
  const [user, setUser] = useState({ username: '' });
  const [stats, setStats] = useState({
    totalTasks: 0,
    completed: 0,
    inProgress: 0,
    projects: 0,
  });
  const navigate = useNavigate();


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user')) || { username: 'Guest' };
    setUser(storedUser);

    const fetchDashboardData = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      try {
        // Fetch projects
        const projectResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const projects = projectResponse.data;

        let totalTasks = 0;
        let completed = 0;
        let inProgress = 0;

        // Fetch tasks for each project
        for (const project of projects) {
          const taskResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/tasks/${project._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const tasks = taskResponse.data;

          totalTasks += tasks.length;
          completed += tasks.filter(task => task.status === 'Completed').length;
          inProgress += tasks.filter(task => task.status === 'In Progress').length;
        }

        setStats({
          totalTasks,
          completed,
          inProgress,
          projects: projects.length,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error.message);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p className="welcome">Welcome back, {user.name}!</p>

      <div className="card-container">
        <div className="card card-blue">
          <div className="card-icon">📝</div>
          <p className="card-label">Total Tasks</p>
          <p className="card-value">{stats.totalTasks}</p>
          <p className="card-note green">↑ +5% from last week</p>
        </div>

        <div className="card card-green">
          <div className="card-icon">✅</div>
          <p className="card-label">Completed</p>
          <p className="card-value">{stats.completed}</p>
          <p className="card-note green">↑ 100% completion rate</p>
        </div>

        <div className="card card-purple">
          <div className="card-icon">⏳</div>
          <p className="card-label">In Progress</p>
          <p className="card-value">{stats.inProgress}</p>
          <p className="card-note gray">{stats.inProgress} tasks to do</p>
        </div>

        <div className="card card-pink">
          <div className="card-icon">👥</div>
          <p className="card-label">Projects</p>
          <p className="card-value">{stats.projects}</p>
          <p className="card-note green">↑ {stats.projects} active</p>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <button className="new-project-btn" onClick={() => navigate('/projects/create')}>
          New Project
        </button>

      </div>
    </div>
  );
}

export default Dashboard;
