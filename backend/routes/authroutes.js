// import express router and authcontroller methods (signup, login)
const express = require('express');
const { signup, login } = require('../controllers/authcontroller');

const router = express.Router(); // create a new router object

// define post routes for signup and login
router.post('/signup', signup);
router.post('/login', login);

module.exports = router; // export the router to use in the app
