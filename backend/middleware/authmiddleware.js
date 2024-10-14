// import jwt for verifying tokens and user model for retrieving user data
const jwt = require('jsonwebtoken');
const user = require('../models/usermodel');

// read the jwt secret from environment variables
const jwt_secret = process.env.JWT_SECRET || 'your_jwt_secret';

// middleware to verify the jwt token in request headers
const protect = async (req, res, next) => {
    let token;

    // check if the request has authorization header with bearer token
    if (req.headers.authorization && req.headers.authorization.starts_with('Bearer')) {
        try {
            // extract the token by splitting the authorization header
            token = req.headers.authorization.split(' ')[1];

            // decode the token to get user id
            const decoded = jwt.verify(token, jwt_secret);

            // fetch user from the database and attach it to request object
            req.user = await user.find_by_id(decoded.id).select('-password'); // omit password

            next(); // proceed to the next middleware or controller
        } catch (error) {
            res.status(401).json({ message: 'not authorized, token failed' }); // unauthorized if token fails
        }
    }

    // if no token is provided, send unauthorized response
    if (!token) {
        res.status(401).json({ message: 'not authorized, no token' });
    }
};

module.exports = protect; // export the middleware
