const express = require("express");
const router = express.Router({mergeParams: true});
const Debate = require('../models/debate');
const Argument = require("../models/argument");

router.get("/new", function(req, res){
    Debate.findById(req.params.id, function(err, foundDebate){
        if(err){
            console.log(err);
        } else {
            res.render("against/new", {debate: foundDebate});
        }
    }); 
});

router.post("/", isLoggedIn, function(req,res){
    Debate.findById(req.params.id, function(err, foundDebate){
        if(err){
            console.log(err);
            res.redirect("/debates");
        } else {
            Argument.create(req.body.against, function(err, againstArg){
                if(err){
                    console.log(err);
                } else {
                    againstArg.author._id = req.user._id;
                    againstArg.author.username = req.user.username;
                    againstArg.save()
                    foundDebate.against = againstArg; 
                    foundDebate.save();
                    res.redirect("/debates/" +  foundDebate._id )
                }
            });
        }
    });
})


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
};

module.exports = router;