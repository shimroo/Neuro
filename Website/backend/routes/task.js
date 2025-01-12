const express = require('express');
const router = express.Router();
const { createTasksForJob } = require('../controllers/taskController');

// Route to create tasks for a job
router.post('/createTask', createTasksForJob);

module.exports = router;
