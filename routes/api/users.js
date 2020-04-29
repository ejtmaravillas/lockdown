const express = require('express');
//add router from express
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const User = require('../../models/Users');

//register user

router.get('/', async (req,res) => {
    try{
        const users = await User.find();
        if (!users) throw Error('No Users');

        res.status(200).json(users);

    } catch (e) {
        res.status(200).json(users);
    }
});


router.post('/register', async (req,res) => {
    try {
        const newUser = new User(req.body);
        CheckUserRegister(newUser, (err2, user) => {
            if(err2 || !user) {
                res.status(400).json({ msg: err2});
            }else{
                res.status(200).json(user);
            }
        });        
    } catch (e) {
        res.status(400).json({  msg: e.message});
    }
});

function CheckUserRegister(user,cb) {
    User.find({email: user.email}, (err,data) => {
        console.log(data);
        if(data.length){
            cb('Username already exists', null);
        }else {
            //hash password from Users model bcrypt userSchema.pre
            console.log('pre save');
            user = hashPassword(user);
            user.save((err) => {
                console.log(user);
                cb(err,user);
            });
        }
    });
}

function hashPassword(user){
    
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(user.password, salt, function(err,hash){
            user.password = hash;
        });
    });
    return user
}

module.exports = router;