const express = require("express");
const router = express.Router();
const passport = require('passport');
const User = require("../models/user");
const Debate = require("../models/debate");
const Category = require("../models/categories");

// LANDING
router.get("/", function(req, res){
    Debate.find({}).sort({createdAt: 'desc'}).exec(function(err, foundDebates){
        if(err){
            console.log(err);
        } else {
            res.render('index',{debates: foundDebates});
        }
    });
});

// TESTING NEW ROUTES
// router.get("/cat/:slug", function(req, res){
//     Category.findOne({slug: req.params.slug}).populate('debates').exec(function(err, foundCat){
//         if(err) {
//             res.send(err);
//         } else {
//             res.render('category/show', {category: foundCat});
//         }
//     });
// });

// ***** THIS IS HOW ROUTES NEED TO BE - NEED TO ASSOCIATE CATEGORIES TO MODELS
// router.get("/cat/:slug/deb/:debateId", function(req, res){
//     Debate.findById(req.params.debateId).populate('comments for against').exec(function(err, foundDeb){
//         if(err) {
//             console.log(err);
//         } else {
//             res.render('debates/show', {debate: foundDeb});
//             console.log(foundDeb);
//         }
//     });
// });


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