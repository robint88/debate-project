const express = require("express");
const router = express.Router();
const passport = require('passport');
const middleware = require('../middleware');
const User = require("../models/user");
const Debate = require("../models/debate");
const Category = require("../models/categories");
const Suggest = require("../models/suggestion");
const crypto = require('crypto');
const async = require('async');
const nodemailer = require('nodemailer');

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

// Reset password
router.get('/forgot', function(req, res){
    res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'robinturnerweb@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'robinturnerweb@gmail.com',
          subject: 'Ornara Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  });

  router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {token: req.params.token});
    });
  });
  
  router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'robinturnerweb@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'robinturnerweb@mail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/');
    });
  });


// about section
router.get('/about', function(req, res){
  res.render('about');
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