const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const auth_routes = require('./routes/authroutes');
const spotify_routes = require('./routes/spotifyroutes'); // import spotify routes

// load environment variables from .env file
dotenv.config();

// log environment variables for debugging
console.log("JWT Secret:", process.env.JWT_SECRET);
console.log("Mongo URI:", process.env.MONGO_URI);
console.log("Spotify Client ID:", process.env.SPOTIFY_CLIENT_ID);
console.log("Spotify Client Secret:", process.env.SPOTIFY_CLIENT_SECRET);
console.log("Spotify Redirect URI:", process.env.SPOTIFY_REDIRECT_URI);

// connect to mongodb using the provided uri from .env
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('mongodb connected'))
    .catch((err) => console.log(err));

const app = express();
app.use(express.json()); // enable json body parsing

app.get('/', (req, res) => {
    res.send('Welcome to the Online Music Player API');
});

// use auth routes for signup/login
app.use('/api/auth', auth_routes);

// use spotify routes for login/search
app.use('/api/spotify', spotify_routes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
