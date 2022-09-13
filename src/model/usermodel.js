const mongoose  = require('mongoose');

const { Schema }  = mongoose;

const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    followers: Array,
    following: Array

},{timestamps : true});

module.exports = mongoose.model('user', UserSchema);