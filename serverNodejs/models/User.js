const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  credits: { type: Number, default: 0 }, // For the credit counter, defaulting to 0
  data: { type: String, default: '' } // For storing dynamic data as a string
});

const User = mongoose.model('User', userSchema);

module.exports = User;
