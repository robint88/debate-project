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
const indexRoutes = require("./routes/index");
// New Routes
const newCategory = require("./routes/newCategory");
const newDebate = require("./routes/newDebate");
const newForRoutes = require("./routes/newFor");
const newAgainstRoutes = require("./routes/newAgainst");
const newCommentRoutes = require("./routes/newComment");
const debateRoutes = require("./routes/debates");

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
// mongoose.connect("mongodb://localhost:27017/debateDB", {useNewUrlParser: true});
mongoose.connect(`mongodb+srv://robin:${process.env.DBPWD}@cluster0-xotq8.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`);
mongoose.set('useFindAndModify', false);

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

// // ROUTES 
app.use(indexRoutes);
// New routes
app.use("/debates/", debateRoutes)
app.use("/category/", newCategory);
app.use("/category/:categorySlug", newDebate);
app.use("/category/:categorySlug/:slug/for", newForRoutes); 
app.use("/category/:categorySlug/:slug/against", newAgainstRoutes); 
app.use("/category/:categorySlug/:slug/discussion",newCommentRoutes); 


//server
app.listen(3000, function(){
    console.log("*************************************");
    console.log("SERVER RUNNING ON POST 3000! WOOHOO!");
    console.log("*************************************");
});