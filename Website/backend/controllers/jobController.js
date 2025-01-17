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


const getJobDetails = async (req, res) => {
  try {
    const { id } = req.params; 

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    
    const tasks = await Task.find({ jobId: id });
    res.status(200).json({
      success: true,
      data: {
        job,
        tasks,
      },
    });
  } catch (error) {
    console.error('Error in getJobDetails:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch job details' });
  }
};

const deletejob = async (req, res) => {
  const { id } = req.params; // Extract job ID from the route parameters

  try {
    // Find the job to ensure it exists
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Delete all tasks associated with the job
    await Task.deleteMany({ jobId: id });

    // Delete the job itself
    await Job.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Job and associated tasks deleted successfully',
    });
  } catch (err) {
    console.error('Error deleting job:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while deleting job',
    });
  }
};

const updateJobOutput = async (jobId) => {
  try {
    // Find all tasks associated with the job
    const tasks = await Task.find({ jobId: jobId });

    // Check if all tasks are not 'DRAFT' or 'PENDING'
    const allTasksCompleted = tasks.every(task => task.output !== 'DRAFT' && task.output !== 'PENDING');

    if (allTasksCompleted) {
      // Count the occurrences of each output
      const outputCounts = tasks.reduce((acc, task) => {
        if (task.output !== 'DRAFT' && task.output !== 'PENDING') {
          acc[task.output] = (acc[task.output] || 0) + 1;
        }
        return acc;
      }, {});

      // Find the most common output
      const mostCommonOutput = Object.keys(outputCounts).reduce((a, b) => outputCounts[a] > outputCounts[b] ? a : b);

      // Update the job output to the most common output
      await Job.findByIdAndUpdate(jobId, { output: mostCommonOutput });

      console.log(`Job output updated to: ${mostCommonOutput}`);
    } else {
      console.log('Job output will not be updated because not all tasks are completed');
    }
  } catch (err) {
    console.error('Error updating job output:', err);
  }
};

// Function to check if all tasks are finalized before updating job output
// const checkAllTasksAndUpdateJob = async (jobId) => {
//   const tasks = await Task.find({ jobId });

//   // Check if all tasks have finished (i.e., not 'DRAFT' or 'PENDING')
//   const allTasksCompleted = tasks.every(task => task.output !== 'DRAFT' && task.output !== 'PENDING');

//   if (allTasksCompleted) {
//     await updateJobOutput(jobId);
//   }
// };

module.exports = { getUserJobs, addJobController, getJobDetails, deletejob};
