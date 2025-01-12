const express = require('express');
const router = express.Router();
const { getUserJobs, addJobController } = require('../controllers/jobController');
const requireAuth = require('../middleware/requireAuth');  // Import the requireAuth middleware

// Apply the middleware to protect the route
router.get('/getuserjobs', getUserJobs);

router.post('/addjob', addJobController)
module.exports = router;
