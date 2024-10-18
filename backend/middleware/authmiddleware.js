const jwt = require('jsonwebtoken');
const user = require('../models/usermodel');

// Middleware to protect routes using JWT
const protect = async (req, res, next) => {
    let token;

    // Check if the authorization header contains a valid Bearer token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try {
            // Extract the token from the header
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user by ID from the decoded token and attach the user to the request
            req.user = await user.findById(decoded.id).select('-password');

            // Proceed to the next middleware or controller
            next();
        } catch (error) {
            // Handle token verification errors
            console.error('Error verifying token:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If no token is provided, return unauthorized error
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = protect;
