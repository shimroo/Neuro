const Task = require('../models/taskModel'); 

// Controller to create one task of each type
const createTasksForJob = async (req, res) => {
  // try {
  //   const { jobId, version } = req.body;

  //   // Check if jobId is provided
  //   if (!jobId) {
  //     return res.status(400).json({ error: 'jobId is required' });
  //   }

  //   // Define the task types
  //   const taskTypes = ['EMO-FACIAL', 'EMO-VOICE', 'EMO-WRITING', 'EMO-EEG', 'EMO-TEXT'];

  //   // Create tasks for each type
  //   const tasks = taskTypes.map((type) => ({
  //     jobId,
  //     name: `${type} Task`,
  //     type,
  //     version: version || 'v1',
  //     file: [], 
  //     output: ["Draft"], 
  //   }));

  //   const createdTasks = await Task.insertMany(tasks);

  //   res.status(201).json({
  //     message: 'Tasks created successfully',
  //     tasks: createdTasks,
  //   });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ error: 'Failed to create tasks' });
  // }
};

const getTaskStatus = async (req, res) => {
  try {
    const { jobId } = req.query; 

    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Missing jobId' });
    }

    const tasks = await Task.find({ jobId });

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ success: false, message: 'Tasks not found' });
    }

    const taskStatusDict = tasks.reduce((dict, task) => {
      dict[task.type] = task.output;
      return dict;
    }, {});
    res.status(200).json({
      success: true,
      data: taskStatusDict,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch task statuses' });
  }
};



module.exports = {
  createTasksForJob, getTaskStatus
};
