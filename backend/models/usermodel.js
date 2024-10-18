const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the user schema
const user_schema = new mongoose.Schema({
    username: {
        type: String,       // String data type for username
        required: true,     // Username is required
        unique: true        // Username must be unique in the database
    },
    password: {
        type: String,       // String data type for password
        required: true      // Password is required
    }
});

// Hash the password before saving the user document to the database
user_schema.pre('save', async function(next) {
    // If password is not modified, skip hashing
    if (!this.is_modified('password')) return next();

    // Hash the password using bcrypt with 10 salt rounds
    this.password = await bcrypt.hash(this.password, 10);
    next();  // Proceed to save the user document
});

// Method to compare entered password with stored hashed password
user_schema.methods.match_password = async function(entered_password) {
    return await bcrypt.compare(entered_password, this.password);
};

// Export the user model
const user = mongoose.model('user', user_schema);
module.exports = user;
