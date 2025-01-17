const express = require('express');
const router = express.Router();
const { getUserJobs, addJobController, getJobDetails,deletejob } = require('../controllers/jobController');
const requireAuth = require('../middleware/requireAuth');  // Import the requireAuth middleware

// Apply the middleware to protect the route
router.get('/getuserjobs', getUserJobs);
router.get('/getJobDetails/:id', getJobDetails)
router.post('/addjob', addJobController)
router.delete('/deletejob/:id',deletejob)
module.exports = router;
