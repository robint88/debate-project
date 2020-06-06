const express = require("express");
const mongoose = require('mongoose');
const router = express.Router({mergeParams: true});
const Debate = require('../models/debate');
const Category = require('../models/categories');
const Argument = require("../models/argument");
const middleware = require("../middleware");

router.get("/new", middleware.checkDebateOwnershipNew, function(req, res){
    Debate.findOne({slug: req.params.slug}, function(err, foundDebate){
        if(err){
            console.log(err);
        } else {
            Category.findOne({slug: req.params.categorySlug}, function(err, foundCat){
                if(err){
                    console.log(err);
                } else {
                    res.render("against/new", {debate: foundDebate, category: foundCat});
                }   
            });  
        }
    }); 
});

router.post("/", middleware.checkDebateOwnershipNew, function(req,res){
    Debate.findOne({slug: req.params.slug}, function(err, foundDebate){
        if(err){
            console.log(err);
            res.redirect("/debates");
        } else {
            Argument.create(req.body.against, function(err, againstArg){
                if(err){
                    console.log(err);
                } else {
                    againstArg.save()
                    foundDebate.against = againstArg; 
                    foundDebate.save();
                    res.redirect("/category/"+ req.params.categorySlug + "/" + req.params.slug );
                }
            });
        }
    });
});

router.get("/:against_id/edit", middleware.checkDebateOwnershipNew, function(req, res){
    Argument.findById(req.params.against_id, function(err, foundArg){
        if(err){
            res.redirect("back");
        } else {
            res.render("against/edit", {debate_slug: req.params.slug, againstArg: foundArg, category_slug: req.params.categorySlug});
        }
    });
});

router.put("/:against_id", middleware.checkDebateOwnershipNew, function(req, res){
    Argument.findByIdAndUpdate(req.params.against_id, req.body.against, function(err, updateArg){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/category/"+ req.params.categorySlug + "/" + req.params.slug );
        }
    });
});
router.put("/vote/:against_id", middleware.isLoggedIn, function(req,res){
    Argument.updateOne({_id: req.params.against_id}, { $inc: {"votes": 1},  $push: {"usersVoted": req.user._id}}, function(err, upvotedArg){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/category/"+ req.params.categorySlug + "/" + req.params.slug );
        }
    });
});
// Change vote
router.put("/changevote/:against_id", middleware.isLoggedIn, function(req,res){
    Argument.updateOne({_id: req.params.against_id}, { $inc: {"votes": -1}, $pull: {"usersVoted": req.user._id}}, function(err, upvotedArg){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/category/"+ req.params.categorySlug + "/" + req.params.slug );
        }
    });
});


module.exports = router;
