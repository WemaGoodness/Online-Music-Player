// import required modules: user model, jwt for token generation, and bcrypt
const user = require('../models/usermodel');
const jwt = require('jsonwebtoken');

// read the jwt secret and expiration from environment variables
const jwt_secret = process.env.JWT_SECRET || 'fallback_jwt_secret';
const jwt_expires_in = '30d';

// generate a jwt token using user id
const generate_token = (id) => {
    return jwt.sign({ id }, jwt_secret, {
        expires_in: jwt_expires_in,  // token expiration set to 30 days
    });
};

// handle user signup
exports.signup = async (req, res) => {
    const { username, password } = req.body; // destructure username and password from request body

    try {
        // create a new user and save it in the database
        const new_user = new user({ username, password });
        await new_user.save();

        // generate jwt token for the new user
        const token = generate_token(new_user._id);

        // send the token back as response
        res.status(201).json({ token });
    } catch (error) {
        res.status(400).json({ message: 'error signing up', error }); // error response if signup fails
    }
};

// handle user login
exports.login = async (req, res) => {
    const { username, password } = req.body; // destructure username and password from request body

    try {
        // check if user exists in the database
        const existing_user = await user.find_one({ username });

        // if user doesn't exist or password doesn't match, send error response
        if (!existing_user || !(await existing_user.match_password(password))) {
            return res.status(401).json({ message: 'invalid credentials' });
        }

        // generate jwt token for the logged-in user
        const token = generate_token(existing_user._id);

        // send the token back as response
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'error logging in', error }); // error response if login fails
    }
};
