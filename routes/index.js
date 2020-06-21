const express = require("express");
const router = express.Router();
const passport = require('passport');
const middleware = require('../middleware');
const User = require("../models/user");
const Debate = require("../models/debate");
const Category = require("../models/categories");
const Suggest = require("../models/suggestion");

// LANDING
router.get("/", function(req, res){
    // Debate.find({}).sort({createdAt: 'desc'}).exec(function(err, foundDebates){
    //     if(err){
    //         console.log(err);
    //     } else {
    //         res.render('index',{debates: foundDebates});
    //     }
    // });
    Category.find({}).sort({name: 1}).exec(function(err, foundCats){
        if(err){
            req.flash('error', "Oops! Something went wrong");
        } else {
            // res.render('index',{categories: foundCats});
            Debate.find({isPublished: true}).sort({createdAt: 'desc'}).populate('category').exec(function(err, foundDebates){
                if(err){
                    req.flash('error', "Something went wrong");
                    res.redirect('back');
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
    const newUser = new User({username: req.body.username, email: req.body.email, isAdmin: false});

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

// Suggest a topic
// New
router.get('/suggest/new', middleware.isLoggedIn, function(req, res){
    Category.find({}).sort({name: 1}).exec(function(err, foundCategories){
        if(err){
            res.redirect('back');
        } else{
            res.render('suggest/new', {categories: foundCategories})
        }
    })
});
// Create
router.post('/suggest', middleware.isLoggedIn, function(req, res){
    Suggest.create(req.body.suggest, function(err, newSuggestion){
        if(err){
            req.flash('error', 'Sorry, something went wrong'); 
            res.redirect('back');
        } else {
            newSuggestion.user.username = req.user.username;
            newSuggestion.user.id = req.user._id;

            newSuggestion.save();
            req.flash('success', 'Your topic suggestion has been sent!');
            res.redirect('/');
        }
    })
});
// Show
router.get('/suggest', middleware.hasAdminAbility, function(req, res){
    Suggest.find({}).sort({createdAt: 'desc'}).exec(function(err, foundSuggestions){
        if(err){
            req.flash('error', "Something went wrong");
            res.redirect('back');
        } else {
            res.render('suggest/index', {suggestions: foundSuggestions});
        }
    });
});

module.exports = router;