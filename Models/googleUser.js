const mongoose = require("mongoose");

const User = mongoose.Schema({
    username: String,
    googleId: String
});

module.exports = mongoose.model('GUser', User);