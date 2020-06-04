const express = require("express");
const mongoose = require('mongoose');
const router = express.Router({mergeParams: true});
const Debate = require('../models/debate');
const Argument = require("../models/argument");
const middleware = require("../middleware");

router.get("/new", middleware.checkDebateOwnership, function(req, res){
    Debate.findById(req.params.id, function(err, foundDebate){
        if(err){
            console.log(err);
        } else {
            res.render("for/new", {debate: foundDebate});
        }
    }); 
});

router.post("/", middleware.checkDebateOwnership, function(req,res){
    Debate.findById(req.params.id, function(err, foundDebate){
        if(err){
            console.log(err);
            res.redirect("/debates");
        } else {
            Argument.create(req.body.for, function(err, forArg){
                if(err){
                    console.log(err);
                } else {
                    forArg.save()
                    foundDebate.for = forArg; 
                    foundDebate.save();
                    res.redirect("/debates/" +  foundDebate._id );
                }
            });
        }
    });
});

router.get("/:for_id/edit", middleware.checkDebateOwnership, function(req, res){
    Argument.findById(req.params.for_id, function(err, foundArg){
        if(err){
            res.redirect("back");
        } else {
            res.render("for/edit", {debate_id: req.params.id, forArg: foundArg});
        }
    });
});

router.put("/:for_id", middleware.checkDebateOwnership, function(req, res){
    Argument.findByIdAndUpdate(req.params.for_id, req.body.for, function(err, updateArg){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/debates/" + req.params.id);  
        }
    });
});
router.put("/vote/:for_id", middleware.isLoggedIn, function(req,res){
    Argument.updateOne({_id: req.params.for_id}, { $inc: {"votes": 1},  $push: {"usersVoted": req.user._id}}, function(err, upvotedArg){
        if(err) {
            console.log(err);
        } else {
            // upvotedArg.votes = req.body.for;
            console.log(upvotedArg);
            res.redirect('/debates/'  +req.params.id);
        }
    });
});
// Change vote
router.put("/changevote/:for_id", middleware.isLoggedIn, function(req,res){
    Argument.updateOne({_id: req.params.for_id}, { $inc: {"votes": -1}, $pull: {"usersVoted": req.user._id}}, function(err, upvotedArg){
        if(err) {
            console.log(err);
        } else {
            // upvotedArg.votes = req.body.for;
            res.redirect('/debates/'  +req.params.id);
        }
    });
});


module.exports = router;
