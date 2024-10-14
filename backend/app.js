// import express, mongoose, dotenv, and routes
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const auth_routes = require('./routes/authroutes');

// load environment variables from .env file
dotenv.config();

// connect to mongodb using the provided uri from .env
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('mongodb connected')) // log success message if connected
    .catch((err) => console.log(err)); // log error if connection fails

// initialize express app
const app = express();
app.use(express.json()); // enable json parsing for requests

// use auth routes for signup/login
app.use('/api/auth', auth_routes);

// start the server on port defined in .env or default to 5000
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
