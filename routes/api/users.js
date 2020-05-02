const express = require("express");
//add router from express
const router = express.Router();
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const User = require("../../models/Users");

//register user

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    if (!users) throw Error("No Users");
    res.status(200).json(users);
  } catch (e) {
    res.status(200).json(users);
  }
});

router.post("/sample", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.post("/register", async (req, res) => {
  try {
    console.log('register start')
    const newUser = new User(req.body);
    console.log('register start a')
    CheckUserRegister(newUser, (err2, user) => {
      if (err2 || !user) {
        res.status(400).json({ registerSuccess: false, msg: err2 });
      } else {
        res.status(200).json({ registerSuccess: true, msg: user });
      }
    });
  } catch (e) {
    console.log('register error')
    res.status(400).json({ registerSuccess: false, msg: e.message });
  }
});

function CheckUserRegister(user, cb) {
  User.find({ email: user.email }, (err, data) => {
    console.log(data);
    if (data.length) {
      cb("Username already exists", null);
    } else {
      //hash password from Users model bcrypt userSchema.pre
      console.log("bcrypt save");
      user.save((err) => {
        console.log("user registered");
        cb(err, user);
      });
    }
  });
}

router.post("/login", (req, res) => {
  try {
      console.log(User)
    User.findOne({ email: req.body.email }, (err, user) => {
      const pass = req.body.password;
      console.log(user);
      if (!user) {
        return res.json({
          loginSuccess: false,
          message: "Auth failed, email not found",
        });
      }
      user.comparePassword(pass, (err, isMatch) => {
        if (!isMatch) {
          return res.json({ loginSuccess: false, message: "Wrong Password" });
        } else {
            console.log('login password confirmed')
        }
      });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie("x_authExp", user.tokenExp);
        res.cookie("x_auth", user.token).status(200).json({
          loginSuccess: true,
          message: "log in success",
        });
        console.log('token generated');
      });
    });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;
