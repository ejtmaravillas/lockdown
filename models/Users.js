const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var userSchema = new Schema({
    name: {
        type: String,
        maxlength: 50,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: 1,
        required: true
    },
    password: {
        type: String,
        minglength: 6,
        required: true
    },
    lastname: {
        type: String,
        maxlength: 50,
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});

const User = mongoose.model('User', userSchema);

module.exports = { User };