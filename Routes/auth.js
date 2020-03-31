const express = require("express");
const router = express.Router();
const path = require("path");
const User = require("../Models/User");
const mongoose = require("mongoose");
const passport = require("passport");
//  /auth/login

router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "/../Pages/login.html"));
});

router.post("/login", passport.authenticate('local', { failureRedirect: '/auth/login', successRedirect: '/' }) ,(req, res) => {
    res.json({message: "ok"});
});

router.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "/../Pages/signup.html"));
});

router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/auth/login");
});

router.post("/signup", (req, res) => {
    console.log(req.body);
    const { email, password, cn_password } = req.body;
    if(email && password && cn_password) {
        User.findOne({email: email}, (err, doc) => {
            if(err) return res.json({error: err});
            if(doc) return res.json({message: "User already Exist"});
            if(password === cn_password) {
                const newUser = new User();
                newUser._id = mongoose.Types.ObjectId();
                newUser.email = email;
                newUser.password = newUser.hashPassword(password);   
                newUser.save((err, user) => {
                    if(err) return res.json({error: err});
                    res.json({message: "ok"});
                });
            }
        });
    }
});

router.get("/logout", (req, res) => {
    res.send("logout");
});

router.get("/google", passport.authenticate('google', {
    scope: ['profile']
}));

router.get("/google/redirect", passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect("/");
});

router.get("/facebook", passport.authenticate('facebook'));

router.get("/facebook/callback", passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
    res.redirect("/");
});


module.exports = router;