const Task = require('../models/Task');
const Project = require('../models/Project');

// Create Task
exports.createTask = async (req, res) => {
  const { title, description, status, completedAt, projectId, createdBy } = req.body;

  // Check required fields
  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Task title is required" });
  }

  if (!projectId || projectId.trim() === "") {
    return res.status(400).json({ message: "Project ID is required" });
  }

  if (!createdBy) {
    return res.status(400).json({ message: "User ID (createdBy) is required" });
  }

  try {
    // Check if the project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Validate status
    const validStatuses = ['Pending', 'In Progress', 'Completed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // If provided, ensure that completedAt is a valid date
    let parsedCompletedAt = null;
    if (completedAt) {
      parsedCompletedAt = new Date(completedAt);
      if (isNaN(parsedCompletedAt)) {
        return res.status(400).json({ message: "Invalid date format for completedAt" });
      }
    }

    // Create the new task
    const task = new Task({
      title,
      description,
      status: status || 'Pending',  // Default to 'Pending' if no status provided
      completedAt: parsedCompletedAt || null,  // Optional field, it can be null or a valid date
      projectId,
      createdBy,  // Ensure createdBy is passed and saved
    });

    // Save the task
    await task.save();
    res.status(201).json({ task });
  } catch (err) {
    console.error("Create Task Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all tasks created by the user (for filter page)
exports.getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id; // Get the logged-in user's ID from the request
    const tasks = await Task.find({ createdBy: userId }); // Filter tasks by createdBy
    res.json(tasks);
  } catch (err) {
    console.error("Get Tasks Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get tasks by project ID (for specific project filtering)
exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.id; // Get the logged-in user's ID from the request
    const tasks = await Task.find({ projectId: req.params.projectId, createdBy: userId }); // Filter tasks by projectId and createdBy
    res.json(tasks);
  } catch (err) {
    console.error("Get Tasks by Project Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  const { title, description, status, completedAt } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Task title is required" });
  }

  try {
    // If provided, ensure that completedAt is a valid date
    let parsedCompletedAt = null;
    if (completedAt) {
      parsedCompletedAt = new Date(completedAt);
      if (isNaN(parsedCompletedAt)) {
        return res.status(400).json({ message: "Invalid date format for completedAt" });
      }
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, {
      title, description, status, completedAt: parsedCompletedAt || null
    }, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updated);  // Return the updated task
  } catch (err) {
    console.error("Update Task Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Delete Task Error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
