const Project = require('../models/Project'); 
const mongoose = require('mongoose');

// Create Project
exports.createProject = async (req, res) => {
  try {
    // Check if the user has 4 or more projects
    const existingProjects = await Project.find({ owner: req.user.id });
    if (existingProjects.length >= 4) {
      return res.status(400).json({ message: "Maximum 4 projects allowed" });
    }

    // Validate project title (add more validation if needed)
    const { title, description } = req.body;
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Project title is required" });
    }

    // Create and save the new project
    const project = new Project({
      title,
      description: description || '',
      owner: req.user.id,
    });

    await project.save();
    res.status(201).json(project); // Return the created project with 201 status code
  } catch (err) {
    console.error("Create Project Error:", err.message);
    console.error("Stack Trace:", err.stack);  // Additional info for debugging
    res.status(500).send("Server error");
  }
};

// Get Projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id });
    res.json(projects);
  } catch (err) {
    console.error("Get Projects Error:", err.message);
    res.status(500).send("Server error");
  }
};

// Get Single Project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check ownership
    if (!project.owner.equals(req.user.id)) {
      return res.status(403).json({ message: "Not authorized to view this project" });
    }

    res.json(project);
  } catch (err) {
    console.error("Get Project By ID Error:", err.message);
    console.error("Stack Trace:", err.stack);  // Additional info for debugging
    res.status(500).send("Server error");
  }
};
// Update Project
exports.updateProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check ownership before update
    if (!project.owner.equals(req.user.id)) {
      return res.status(403).json({ message: "Not authorized to update this project" });
    }

    // Update fields
    project.title = title || project.title;
    project.description = description || project.description;
    project.updatedAt = new Date(); // Optional: if you're tracking last update

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (err) {
    console.error("Update Project Error:", err.message);
    res.status(500).send("Server error");
  }
};

// Delete Project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check ownership before deletion
    if (!project.owner.equals(req.user.id)) {
      return res.status(403).json({ message: "Not authorized to delete this project" });
    }

    // Delete the project
    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Delete Project Error:", err.message);
    console.error("Stack Trace:", err.stack);  // Additional info for debugging
    res.status(500).send("Server error");
  }
};
