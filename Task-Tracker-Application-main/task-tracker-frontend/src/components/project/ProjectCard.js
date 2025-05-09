import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProjectCard.css';

const ProjectCard = ({ project, totalTasks, completedTasks }) => {
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Function to format description if needed
  const formatDescription = (description) => {
    return description ? description : 'No description available';
  };

  useEffect(() => {
    // Recalculate progress whenever totalTasks and completedTasks change
    const progressPercentage = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
    setProgress(progressPercentage);
    setIsCompleted(totalTasks && completedTasks === totalTasks);
  }, [totalTasks, completedTasks]); // Dependency on totalTasks and completedTasks

  return (
    <div className={`project-card ${isCompleted ? 'completed' : ''}`}>
      <div className="card-header">
        <h3 className="project-title">{project.title}</h3>
      </div>

      <div className="card-body">
        <p className="project-description">{formatDescription(project.description)}</p>
        <div className="status-section">
          <p className={`project-status ${isCompleted ? 'done' : 'in-progress'}`}>
            Status: {isCompleted ? 'Completed' : 'In Progress'}
          </p>
          <div className="horizontal-progress-container">
            <div className="horizontal-progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="progress-percent">{Math.round(progress)}%</p>
          </div>
          <p className="task-count">
            {completedTasks} / {totalTasks} Tasks Completed
          </p>
        </div>
      </div>

      <div className="card-footer">
        <Link to={`/projects/${project._id}`} className="view-details-btn">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
