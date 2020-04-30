const express = require('express');
//add router from express
const router = express.Router();
const bcrypt = require('bcryptjs');
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
            //user1 = hashPassword(user);
            bcrypt.genSalt(saltRounds, (err, salt) => {
                bcrypt.hash(user.password, salt, (err,hash) => {
                    user.password = hash;
                    console.log(user);
                    user.save((err) => {
                        cb(err,user);
                    });
                });
            });
        }
    });
}

router.post('/login', (req,res) => {
    try{
        User.findOne({email: req.body.email}, (err, user) => {
            const pass = req.body.password;
            console.log(`input password: ${pass}`);
            console.log(`user: ${user}`);
            if(!user){
                return res.json({
                    loginSuccess: false,
                    message: "Auth failed, email not found"
                });
            }            
            //checkLogin = checkPassword(user, pass);
            bcrypt.compare(pass,user.password, (err, result) => {
                if(!result) return res.json({ loginSuccess: false, message: "Wrong password" });
                return res.json({ loginSuccess: true, message: "Login success"});
            });
        });
    }catch(e) {
        res.status(400).json({  msg: e.message});
    }
});

function checkPassword(user, password){
    hash = user.password;
    bcrypt.compare(password,hash, (err, res) => {
        return res;
    });
}

function hashPassword(user){
<<<<<<< HEAD
=======
    const userC = new User(user)
>>>>>>> 4b5300a791d0600e40cbf30f30d79e530176ea97
    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(user.password, salt, (err,hash) => {
            userC.password = hash;
        });
    });
    console.log(`UserC: ${userC}`);
    return userC;
}

module.exports = router;