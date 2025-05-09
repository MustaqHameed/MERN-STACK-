const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  deleteProject,
  getProjectById,
  updateProject // ✅ Added update controller
} = require('../controllers/projectController');

const auth = require('../middleware/authMiddleware');

// Create a new project
router.post('/', auth, createProject);

// Get all projects
router.get('/', auth, getProjects);

// Get a specific project
router.get('/:id', auth, getProjectById);

// Update a project ✅
router.put('/:id', auth, updateProject);

// Delete a project
router.delete('/:id', auth, deleteProject);

module.exports = router;