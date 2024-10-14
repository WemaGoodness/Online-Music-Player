// require mongoose for database operations and bcrypt for hashing passwords
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// define the user schema with username and password fields
const user_schema = new mongoose.Schema({
    username: {
        type: String,       // string data type for username
        required: true,     // username is required
        unique: true        // username must be unique in the database
    },
    password: {
        type: String,       // string data type for password
        required: true      // password is required
    }
});

// encrypt password before saving it to the database
user_schema.pre('save', async function(next) {
    // if password is not modified, continue to the next middleware
    if (!this.is_modified('password')) return next();

    // hash the password using bcrypt with 10 salt rounds
    this.password = await bcrypt.hash(this.password, 10);
    next(); // proceed to save the user
});

// method to compare entered password with stored hashed password
user_schema.methods.match_password = async function(entered_password) {
    return await bcrypt.compare(entered_password, this.password);
};

// export the user model using the defined schema
const user = mongoose.model('user', user_schema);
module.exports = user;
