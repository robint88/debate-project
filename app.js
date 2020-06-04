require('dotenv').config();
const express = require('express');
const methodOverride = require('method-override');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
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
const forRoutes = require("./routes/for");
const againstRoutes = require("./routes/against");
const categoryRoutes = require("./routes/category");

const seedDB = require("./seeds");

const app = express();


//set ejs view engine, body-parser, public directory,method override and moment
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');



// Set up DB
// seedDB();
mongoose.connect("mongodb://localhost:27017/debateDB", {useNewUrlParser: true});

// Configure Passport
app.use(require("express-session")({
    secret: process.env.PASSPORT_SECRET,
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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// ROUTES 
app.use(indexRoutes);
app.use("/debates", debateRoutes);
app.use("/debates/:id/for", forRoutes);
app.use("/debates/:id/against", againstRoutes);
app.use("/debates/:id/discussion",commentRoutes);
app.use("/categories", categoryRoutes);


//server
app.listen(3000, function(){
    console.log("*************************************");
    console.log("SERVER RUNNING ON POST 3000! WOOHOO!");
    console.log("*************************************");
});