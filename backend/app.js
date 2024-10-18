const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const spotify_routes = require('./routes/spotifyroutes');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('mongodb connected'))
    .catch((err) => console.log(err));

// Initialize express app
const app = express();
app.use(express.json());

// Configure express-session middleware for session handling
app.use(session({
    secret: process.env.SESSION_SECRET,  // Secret for session encryption
    resave: false,  // Avoid resaving session if unmodified
    saveUninitialized: true,  // Save new but unmodified sessions
    cookie: {
        secure: false,  // Set to true in production (requires HTTPS)
        maxAge: 60 * 60 * 1000  // 1-hour session expiration
    }
}));

// Spotify API routes
app.use('/api/spotify', spotify_routes);

// Start the server on the specified port
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
