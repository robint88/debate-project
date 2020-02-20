require('dotenv').config();
const express = require('express');
const methodOverride = require('method-override');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');

const Debate = require("./models/debate");
const Comment = require("./models/comment");
const User = require("./models/user");

const seedDB = require("./seeds");

const app = express();


//set ejs view engine, body-parser& public directory
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));
app.use(methodOverride("_method"));


// Set up DB
seedDB();
mongoose.connect("mongodb://localhost:27017/debateDB", {useNewUrlParser: true});

// Configure Passport
app.use(require("express-session")({
    secret: "Lando is a barky boy!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Pass in current user
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

// ROUTES 

// LANDING
app.get("/", function(req, res){
    res.render('index');
});

//************************************** 
// DEBATES
//************************************** 

// INDEX OF DEBATES
app.get("/debates", function(req,res){
    Debate.find(function(err, foundDebates){
        if(err){
            console.log(err);
        } else {
            res.render('debates/debates',{debates: foundDebates});
        }
    });
});
//NEW
app.get("/debates/new", function(req,res){
    res.render("debates/compose");
});
//CREATE
app.post("/debates", function(req,res){
    Debate.create(req.body.debate, function(err, newArg){
        if(err){
            res.render('compose');
        } else {
            res.redirect("/debates/" + newArg._id);
        }
    });
});
// SHOW
app.get("/debates/:id", function(req, res){
    Debate.findById(req.params.id).populate("comments").exec(function(err, foundArg){
        if(err){
            res.redirect("/debates");
            console.log(err);
        } else {
            console.log(foundArg);
            res.render("debates/show", {debate: foundArg});
        }
    });
});
// EDIT
app.get("/debates/:id/edit", function(req,res){
    Debate.findById(req.params.id, function(err, foundArg){
        if(err){
            res.redirect("/debates");
            console.log(err);
        } else {
            res.render("debates/edit", {debate: foundArg});
        }
    });
});
// UPDATE
app.put("/debates/:id", function(req,res){
    Debate.findByIdAndUpdate(req.params.id, req.body.debate, function(err, updatedArg){
        if(err){
            res.redirect("/debates");
            console.log(err);
        } else {
            console.log(updatedArg);
            res.redirect("/debates/" + req.params.id);
        }
    });
});
// DESTROY
app.delete("/debates/:id", function(req,res){
    Debate.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/debates");
            console.log(err);
        } else {
            res.redirect("/debates");
        }
        
    });
    // res.send("THIS WAY");
});


//************************************** 
// DISCUSSION
//************************************** 

//New
app.get("/debates/:id/discussion/new", isLoggedIn, function(req, res){
    Debate.findById(req.params.id, function(err, foundDebate){
        if(err){
            console.log(err);
        } else {
            res.render("discussion/new", {debate: foundDebate});
        }
    });
});

//Create
app.post("/debates/:id/discussion", isLoggedIn, function(req, res){
    Debate.findById(req.params.id, function(err, foundDebate){
        if(err){
            console.log(err);
            res.redirect("/debates");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    foundDebate.comments.push(comment);
                    foundDebate.save();
                    res.redirect("/debates/"+ foundDebate._id);
                }
            })
        }
    });
});

// Authentication Routes
//  Register
app.get("/register", function(req, res){
    res.render("register");
});

// Signup logic
app.post('/register', function(req, res){
    const newUser = new User({username: req.body.username});

    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req,res, function(){
            res.redirect("/debates");
        });
    });
});

// Login
app.get("/login", function(req,res){
    res.render("login");
});
// Login Logic
app.post("/login", passport.authenticate("local", {
        successRedirect: "/debates",
        failureRedirect: "/login"
    }), function(req, res){
        // Can actually delete this function - kept just to show middleware
});


// Logout
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/debates");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
};

//server
app.listen(3000, function(){
    console.log("*************************************");
    console.log("SERVER RUNNING ON POST 3000! WOOHOO!");
    console.log("*************************************");
});