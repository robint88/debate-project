require('dotenv').config();
const express = require('express');
const methodOverride = require('method-override');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local');
// Models
const Debate = require("./models/debate");
const Comment = require("./models/comment");
const User = require("./models/user");
// Routes
const debateRoutes = require("./routes/debates");
const commentRoutes = require("./routes/comments");
const indexRoutes = require("./routes/index");

const seedDB = require("./seeds");

const app = express();


//set ejs view engine, body-parser& public directory
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));
app.use(methodOverride("_method"));


// Set up DB
// seedDB();
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
app.use(indexRoutes);
app.use("/debates/:id/discussion",commentRoutes);
app.use("/debates", debateRoutes);


//server
app.listen(3000, function(){
    console.log("*************************************");
    console.log("SERVER RUNNING ON POST 3000! WOOHOO!");
    console.log("*************************************");
});