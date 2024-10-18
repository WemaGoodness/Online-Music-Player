// Import express and authentication controller
const express = require('express');
const { signup, login } = require('../controllers/authcontroller');

const router = express.Router();

// Route for user signup
router.post('/signup', signup);

// Route for user login
router.post('/login', login);

// Export the router
module.exports = router;
