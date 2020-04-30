const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const Schema = mongoose.Schema;


var userSchema = new Schema({
    username: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true
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

//hash password
// userSchema.pre('save', ( next ) => {
//     var user = this;
//     if(user.isModified('password')) {
//       bcrypt.genSalt(saltRounds, (err,salt) => {
        
//         if(err) return next(err);
//         bcrypt.hash( user.password, salt, (err,hash) => {
//             console.log(err);
//             if(err) return next(err);
//             user.password = hash;
//         });
//       });  
//     } else {
        
//         next();
//     }
//     console.log('password is not modified')
// });


const Users = mongoose.model('User', userSchema);

module.exports =  Users;