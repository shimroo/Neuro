require('dotenv').config();
const Job = require('./models/jobModel.js');   
const Task = require('./models/taskModel'); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const multer = require('multer'); // Import multer
const path = require('path');
const fs = require('fs');

const workoutRoutes = require('./routes/workouts');
const userRoutes = require('./routes/user');
const jobRoutes = require('./routes/jobs');
const taskRoutes = require('./routes/task');

const { sendTaskToQueue } = require('./rabbit');  

// Express app
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // React's development server URL
  methods: 'GET,POST,PUT,DELETE', // Allowed HTTP methods
  allowedHeaders: 'Content-Type, Authorization', // Allowed headers
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

const uploadFolder = path.join(require('os').homedir(), 'Downloads'); 
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder); 
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder); 
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); 
  },
});

const upload = multer({ storage });


// Add the task to the RabbitMQ queue after saving the file
app.post('/api/jobs/:type/upload', upload.single('image'), async (req, res) => {
  const { jobId } = req.body;
  const { type } = req.params;

  if (!jobId || !req.file) {
    return res.status(400).json({ error: 'Job ID and image file are required.' });
  }

  const filePath = path.resolve(req.file.path);

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    const task = await Task.findOne({ jobId, type });
    if (!task) {
      return res.status(404).json({ error: `${type} task not found for this job.` });
    }

    task.file = task.file || [];
    task.file.push(filePath);
    task.output = "PENDING";
    await task.save();

    // Send task to RabbitMQ
    let queueName;
    if (type === 'EMO-FACIAL') {
      queueName = 'facial_queue';
    } else if (type === 'EMO-VOICE') {
      queueName = 'audio_queue';
    } else if (type === 'EMO-TEXT') {
      queueName = 'writing_queue';
    } else {
      queueName = 'eeg_queue'; 
    }

    // Send the task to RabbitMQ
    await sendTaskToQueue( queueName, jobId, { filePath, jobId });


    // Send a response indicating success
    res.json({ success: true, taskId: jobId, filePath });

  } catch (error) {
    console.error('Error saving task:', error);
    res.status(500).json({ error: 'Failed to save task details.' });
  }
});


app.post('/api/jobs/:type/uploadvoice', upload.single('audio'), async (req, res) => {
  const { jobId } = req.body;
  const { type } = req.params;

  // Check if jobId and audio file are provided
  if (!jobId || !req.file) {
    return res.status(400).json({ error: 'Job ID and audio file are required.' });
  }

  const filePath = path.resolve(req.file.path);

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    const task = await Task.findOne({ jobId, type });
    if (!task) {
      return res.status(404).json({ error: `${type} task not found for this job.` });
    }

    task.file = task.file || []; 
    task.file.push(filePath);
    task.output = "PENDING"
    await task.save();

    let queueName;
    if (type === 'EMO-FACIAL') {
      queueName = 'facial_queue';
    } else if (type === 'EMO-VOICE') {
      queueName = 'audio_queue';
    } else if (type === 'EMO-TEXT') {
      queueName = 'writing_queue';
    } else {
      queueName = 'eeg_queue'; 
    }

    // Send the task to RabbitMQ
    await sendTaskToQueue( queueName, jobId, { filePath, jobId });
    res.json({ success: true, taskId: task._id, filePath });
  } catch (error) {
    console.error('Error saving task:', error);
    res.status(500).json({ error: 'Failed to save task details.' });
  }
});

app.post('/api/jobs/:type/uploadtext', async (req, res) => {
  const { jobId, text } = req.body;
  const { type } = req.params;

  if (!jobId || !text) {
    return res.status(400).json({ error: 'Job ID and text are required.' });
  }

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    const task = await Task.findOne({ jobId, type });
    if (!task) {
      return res.status(404).json({ error: `${type} task not found for this job.` });
    }
    console.log(text)
    task.file = task.file || [];
    task.file = [text];
    task.output = "PENDING"

    await task.save();

    let queueName;
    if (type === 'EMO-FACIAL') {
      queueName = 'facial_queue';
    } else if (type === 'EMO-VOICE') {
      queueName = 'audio_queue';
    } else if (type === 'EMO-TEXT') {
      queueName = 'writing_queue';
    } else {
      queueName = 'eeg_queue'; 
    }

    // Send the task to RabbitMQ
    await sendTaskToQueue( queueName, jobId, { text, jobId });
    res.json({ success: true, taskId: task._id });
  } catch (error) {
    console.error('Error saving task:', error);
    res.status(500).json({ error: 'Failed to save task details.' });
  }
});

app.post('/api/jobs/:type/uploadwriting', upload.single('file'), async (req, res) => {
  const { jobId } = req.body;
  const { type } = req.params;

  // Check if jobId and audio file are provided
  if (!jobId || !req.file) {
    return res.status(400).json({ error: 'Job ID and audio file are required.' });
  }

  const filePath = path.resolve(req.file.path);

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }
    const task = await Task.findOne({ jobId, type });
    if (!task) {
      return res.status(404).json({ error: `${type} task not found for this job.` });
    }
    task.file = task.file || []; 
    task.file.push(filePath);
    task.output = "PENDING"
    await task.save();

    let queueName;
    if (type === 'EMO-FACIAL') {
      queueName = 'facial_queue';
    } else if (type === 'EMO-VOICE') {
      queueName = 'audio_queue';
    } else if (type === 'EMO-TEXT') {
      queueName = 'writing_queue';
    } else {
      queueName = 'eeg_queue'; 
    }

    // Send the task to RabbitMQ
    await sendTaskToQueue( queueName, jobId, { filePath, jobId });
    res.json({ success: true, taskId: task._id, filePath });
  } catch (error) {
    console.error('Error saving task:', error);
    res.status(500).json({ error: 'Failed to save task details.' });
  }
});

app.post('/api/jobs/:type/uploadeeg', upload.single('file'), async (req, res) => {
  const { jobId } = req.body;
  const { type } = req.params;

  if (!jobId || !req.file) {
    return res.status(400).json({ error: 'Job ID and audio file are required.' });
  }

  const filePath = path.resolve(req.file.path);

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found.' });
    }
    const task = await Task.findOne({ jobId, type });
    if (!task) {
      return res.status(404).json({ error: `${type} task not found for this job.` });
    }
    task.file = task.file || []; 
    task.file.push(filePath);
    task.output = "PENDING"
    await task.save();

    let queueName;
    if (type === 'EMO-FACIAL') {
      queueName = 'facial_queue';
    } else if (type === 'EMO-VOICE') {
      queueName = 'audio_queue';
    } else if (type === 'EMO-TEXT') {
      queueName = 'writing_queue';
    } else {
      queueName = 'eeg_queue'; 
    }

    // Send the task to RabbitMQ
    await sendTaskToQueue( queueName, jobId, { filePath, jobId });
    res.json({ success: true, taskId: task._id, filePath });
  } catch (error) {
    console.error('Error saving task:', error);
    res.status(500).json({ error: 'Failed to save task details.' });
  }
});

// Routes
app.use('/api/workouts', workoutRoutes);
app.use('/api/user', userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/task", taskRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('Connected to DB & listening on port', process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
