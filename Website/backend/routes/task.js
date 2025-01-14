const express = require('express');
const router = express.Router();
const { createTasksForJob,getTaskStatus } = require('../controllers/taskController');

// Route to create tasks for a job
router.post('/createTask', createTasksForJob);

router.get('/status', getTaskStatus)
module.exports = router;
