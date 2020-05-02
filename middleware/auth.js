const User = require('../../models/Users');

let auth = (req,res,next) => {
    let token = req.cookie.x_auth;

    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user){
            return res.json({
                isAuthenticated: false, error: true
            });
        }
        req.token = token;
        req.user = user;
        next();
    });
};

module.exports = { auth };