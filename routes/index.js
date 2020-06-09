const express = require("express");
const router = express.Router();
const passport = require('passport');
const User = require("../models/user");
const Debate = require("../models/debate");
const Category = require("../models/categories");

// LANDING
router.get("/", function(req, res){
    // Debate.find({}).sort({createdAt: 'desc'}).exec(function(err, foundDebates){
    //     if(err){
    //         console.log(err);
    //     } else {
    //         res.render('index',{debates: foundDebates});
    //     }
    // });
    Category.find({}).populate('debates').sort({name: 1}).exec(function(err, foundCats){
        if(err){
            req.flash('error', "Oops! Something went wrong");
        } else {
            // res.render('index',{categories: foundCats});
            Debate.find({}).sort({createdAt: 'desc'}).exec(function(err, foundDebates){
                if(err){
                    console.log(err);
                } else {
                    res.render('index',{debates: foundDebates,categories: foundCats});
                }
            });
        }
    })
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

// ***** THIS IS HOW ROUTES NEED TO BE - NEED TO MERGEPARAMS IN 
// THE ROUTE (SEE COMMENTS ROUTE AS EXAMPLE) AND ASSOCIATE CATEGORIES TO MODELS ***
// router.get("/cat/:slug/:debateId", function(req, res){
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
            req.flash('error', err.message);
            res.redirect('back');
        }
        passport.authenticate("local")(req,res, function(){
            req.flash('success', 'Welcome, ' + user.username);
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
        successRedirect: "/",
        failureRedirect: "/login"
    }), function(req, res){
        // Can actually delete this function - kept just to show middleware
});


// Logout
router.get("/logout", function(req,res){
    req.logout();
    req.flash('success', "Logged Out");
    res.redirect("/");
});


module.exports = router;