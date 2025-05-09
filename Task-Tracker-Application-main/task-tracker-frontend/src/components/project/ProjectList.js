import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProjectCard from './ProjectCard';
import '../styles/ProjectList.css';
import { useNavigate } from 'react-router-dom';

const ProjectList = ({ refreshProjects }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectsWithTasks = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        
        // Fetch projects
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const projects = res.data;

        // Fetch tasks for each project using projectId in the path
        const projectsWithTaskCounts = await Promise.all(
          projects.map(async (project) => {
            try {
              const taskRes = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/api/tasks/${project._id}`, // Fetch tasks using projectId in path
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              const tasks = taskRes.data;
              const totalTasks = tasks.length;

              // Calculate counts for Pending, In Progress, and Completed tasks
              const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
              const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;
              const completedTasks = tasks.filter(task => task.status === 'Completed').length;

              // Adding task counts to the project object
              return { ...project, tasks, totalTasks, pendingTasks, inProgressTasks, completedTasks };
            } catch (taskErr) {
              console.error(`Failed to fetch tasks for project ${project._id}`);
              return { ...project, tasks: [], totalTasks: 0, pendingTasks: 0, inProgressTasks: 0, completedTasks: 0 }; // If tasks fail, return empty array
            }
          })
        );

        setProjects(projectsWithTaskCounts);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsWithTasks();
  }, [refreshProjects]); // Only refetch when refreshProjects changes

  if (loading) {
    return (
      <div className="loading-spinner">
        <p>Loading...</p> {/* You could replace this with a spinner */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="project-list-container">
      <div className="project-header">
        <h2>Your Projects</h2>
        <button
          className="create-project-btn"
          onClick={() => navigate('/projects/create')}
        >
          Create New Project
        </button>
      </div>

      <div className="project-list">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              totalTasks={project.totalTasks}
              pendingTasks={project.pendingTasks}
              inProgressTasks={project.inProgressTasks}
              completedTasks={project.completedTasks}
            />
          ))
        ) : (
          <div className="no-projects">
            <p>No projects found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
