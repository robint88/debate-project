const express = require("express");
const router = express.Router();
const passport = require('passport');
const User = require("../models/user");
const Debate = require("../models/debate");

// LANDING
router.get("/", function(req, res){
    Debate.find(function(err, foundDebates){
        if(err){
            console.log(err);
        } else {
            res.render('index',{debates: foundDebates});
        }
    });
});

// Authentication Routes
//  Register
router.get("/register", function(req, res){
    res.render("register");
});

// Signup logic
router.post('/register', function(req, res){
    const newUser = new User({username: req.body.username});

    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req,res, function(){
            res.redirect("/");
        });
    });
});

// Login
router.get("/login", function(req,res){
    res.render("login");
});
// Login Logic
router.post("/login", passport.authenticate("local", {
        successRedirect: "/debates",
        failureRedirect: "/login"
    }), function(req, res){
        // Can actually delete this function - kept just to show middleware
});


// Logout
router.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
};

module.exports = router;