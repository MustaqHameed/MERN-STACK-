import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

function Header({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    setDropdownOpen(false);
    if (onLogout) onLogout(); // Call App's handler
    navigate('/login', { replace: true });
  };

  return (
    <header className="header">
      <div className="logo">
         <span>Task Tracker</span>
      </div>

      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <nav className={`nav-links ${menuOpen ? 'show' : ''}`}>
        <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Dashboard</Link>
        <Link to="/projects" className={isActive('/projects') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Projects</Link>
        <Link to="/tasks" className={isActive('/tasks') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Tasks</Link>
      </nav>

      {user && (
        <div className="profile-container" ref={dropdownRef}>
          <div className="profile-icon" onClick={() => setDropdownOpen(!dropdownOpen)}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <p><strong>{user.name}</strong></p>
              <p>{user.email}</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
