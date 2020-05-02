const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const saltRounds = 10;

const Schema = mongoose.Schema;

//var userSchema = new Schema({
var userSchema = new Schema({
    username: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minglength: 6
    },
    fullname: {
        type: String,
        maxlength: 50
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

userSchema.pre('save', function (next) {
    var user = this;
    console.log('pre save called');
    if(user.isModified('password')) {
        console.log('password changed')
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if(err) return next(err);
            bcrypt.hash(user.password, salt, (err, hash) => {
                if(err) return next(err);
                user.password = hash;
                next();
            })
        });
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    });
}


userSchema.methods.generateToken = function (cb) {
    var user = this;
    console.log(user);
    var token = jwt.sign({user: user._id.toHexString()},'secret')
    var oneHour = moment().add(1, 'hour').valueOf();

    user.tokenExp = oneHour;
    user.token = token;
    user.save(function (err, user) {
        if (err) return cb(err);
        cb(null, user);
    });
};

userSchema.methods.generateToken = function (cb) {
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'secret')
    var oneHour = moment().add(1, 'hour').valueOf();

    user.tokenExp = oneHour;
    user.token = token;
    user.save(function (err, user) {
        if (err) return cb(err)
        cb(null, user);
    })
}

userSchema.statics.fidByToken = function (token, cb) {
    var user = this;

    jwt.verify(token, 'secret', (err, decode) => {
        user.findOne({"_id": decode, "token":token }, (err, user) =>{
            if (err) return cb(err);
            cb(null, user);
        })
    })
}

const Users = mongoose.model('User', userSchema);

module.exports = Users;