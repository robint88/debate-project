require('dotenv').config();
const express = require('express');
const methodOverride = require('method-override');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();


//set ejs view engine, body-parser& public directory
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));
app.use(methodOverride("_method"));

// Set up DB
mongoose.connect("mongodb://localhost:27017/debateDB", {useNewUrlParser: true});

const debateSchema = new mongoose.Schema({
    title: String, 
    author: String,
    content: String
});
const DebateArgument = mongoose.model("Debate", debateSchema);

// ROUTES 

// LANDING
app.get("/", function(req, res){
    res.render('index');
});

// INDEX OF DEBATES
app.get("/debates", function(req,res){
    DebateArgument.find(function(err, foundDebates){
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
    DebateArgument.create(req.body.debate, function(err, newArg){
        if(err){
            res.render('compose');
        } else {
            res.redirect("/debates/" + newArg._id);
        }
    });
});
// SHOW
app.get("/debates/:id", function(req, res){
    DebateArgument.findById(req.params.id, function(err, foundArg){
        if(err){
            res.redirect("/debates");
            console.log(err);
        } else {
            res.render("debates/show", {debate: foundArg});
        }
    });
});
// EDIT
app.get("/debates/:id/edit", function(req,res){
    DebateArgument.findById(req.params.id, function(err, foundArg){
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
    DebateArgument.findByIdAndUpdate(req.params.id, req.body.debate, function(err, updatedArg){
        if(err){
            res.redirect("/debates");
            console.log(err);
        } else {
            res.redirect("/debates/" + req.params.id);
        }
    });
});
// DESTROY
app.delete("/debates/:id", function(req,res){
    DebateArgument.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/debates");
            console.log(err);
        } else {
            res.redirect("/debates");
        }
        
    });
    // res.send("THIS WAY");
});

//server
app.listen(3000, function(){
    console.log("*************************************");
    console.log("SERVER RUNNING ON POST 3000! WOOHOO!");
    console.log("*************************************");
});