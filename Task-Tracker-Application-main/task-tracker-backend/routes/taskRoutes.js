const express = require('express');
const router = express.Router();
const {
  createTask,
  getAllTasks,
  getTasks,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const auth = require('../middleware/authMiddleware');

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', auth, createTask);

// @route   GET /api/tasks
// @desc    Get all tasks for the authenticated user
// @access  Private
router.get('/', auth, getAllTasks);

// @route   GET /api/tasks/:projectId
// @desc    Get tasks for a specific project
// @access  Private
router.get('/:projectId', auth, getTasks);

// @route   PUT /api/tasks/:id
// @desc    Update a task by ID
// @access  Private
router.put('/:id', auth, updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task by ID
// @access  Private
router.delete('/:id', auth, deleteTask);

module.exports = router;
