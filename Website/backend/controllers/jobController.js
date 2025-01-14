const User = require('../models/userModel.js');
const Job = require('../models/jobModel.js');
const Task = require('../models/taskModel.js'); 

const getUserJobs = async (req, res) => {
  try {
    
    const userEmail = req.query.email; 
    
    
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const jobs = await Job.find({ userId: userEmail }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch jobs' });
  }
};

const addJobController = async (req, res) => {
  try {
    const { email, type } = req.body;

    if (!type) {
      return res.status(400).json({ error: "Invalid data provided" });
    }

    const newJob = new Job({
      userId: email,
      type,
    });
    const savedJob = await newJob.save();



    const taskTypes = ['EMO-FACIAL', 'EMO-VOICE', 'EMO-WRITING', 'EMO-EEG', 'EMO-TEXT'];
    const tasks = taskTypes.map((taskType) => ({
      jobId: savedJob._id, 
      name: `${taskType} Task`,
      type: taskType,
      version: 'v1',
      file: [],
      output: 'DRAFT',
    }));
    const createdTasks = await Task.insertMany(tasks);

    return res.status(201).json({
      message: "Job and tasks created successfully",
      jobId: savedJob._id,
    });
  } catch (error) {
    console.error("Error in addJobController:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = { getUserJobs, addJobController };
