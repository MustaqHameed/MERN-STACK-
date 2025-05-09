import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import SignupForm from './components/Auth/SignupForm';
import LoginForm from './components/Auth/LoginForm';
import ProjectList from './components/project/ProjectList';
import CreateProjectForm from './components/project/CreateProjectForm';
import ProjectDetails from './components/project/ProjectDetails';
import TaskForm from './components/tasks/TaskForm';

import TaskList from './components/tasks/TaskList';
import Dashboard from './components/Dashboard/Dashboard';
import PostLoginHeader from './components/Layout/Header';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userLoggedIn = localStorage.getItem('authToken') !== null;
    setIsLoggedIn(userLoggedIn);
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem('authToken', token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
  };

  return (
    <div className="app">
      {/* Show header only after login */}
      {isLoggedIn && <PostLoginHeader onLogout={handleLogout} />}

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/dashboard" /> : <LoginForm onLogin={handleLogin} />
          }
        />
        <Route
          path="/signup"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <SignupForm />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/projects"
          element={isLoggedIn ? <ProjectList /> : <Navigate to="/login" />}
        />
        <Route
          path="/projects/create"
          element={isLoggedIn ? <CreateProjectForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/projects/:projectId"
          element={isLoggedIn ? <ProjectDetails /> : <Navigate to="/login" />}
        >
          {/* Nested task routes under project */}
          <Route path="tasks" element={<TaskList />} />
          <Route path="tasks/new" element={<TaskForm />} />
          
        </Route>

        {/* New: Global route for task list */}
        <Route
          path="/tasks"
          element={isLoggedIn ? <TaskList /> : <Navigate to="/login" />}
        />

        {/* Fallback route */}
        <Route
          path="*"
          element={
            isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
