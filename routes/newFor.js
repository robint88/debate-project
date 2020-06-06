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
                    res.render("for/new", {debate: foundDebate, category: foundCat});
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
            Argument.create(req.body.for, function(err, forArg){
                if(err){
                    console.log(err);
                } else {
                    forArg.save()
                    foundDebate.for = forArg; 
                    foundDebate.save();
                    res.redirect("/category/"+ req.params.categorySlug + "/" + req.params.slug );
                }
            });
        }
    });
});

router.get("/:for_id/edit", middleware.checkDebateOwnershipNew, function(req, res){
    Argument.findById(req.params.for_id, function(err, foundArg){
        if(err){
            res.redirect("back");
        } else {
            res.render("for/edit", {debate_slug: req.params.slug, forArg: foundArg, category_slug: req.params.categorySlug});
        }
    });
});

router.put("/:for_id", middleware.checkDebateOwnershipNew, function(req, res){
    Argument.findByIdAndUpdate(req.params.for_id, req.body.for, function(err, updateArg){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/category/"+ req.params.categorySlug + "/" + req.params.slug );
        }
    });
});
router.put("/vote/:for_id", middleware.isLoggedIn, function(req,res){
    Argument.updateOne({_id: req.params.for_id}, { $inc: {"votes": 1},  $push: {"usersVoted": req.user._id}}, function(err, upvotedArg){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/category/"+ req.params.categorySlug + "/" + req.params.slug );
        }
    });
});
// Change vote
router.put("/changevote/:for_id", middleware.isLoggedIn, function(req,res){
    Argument.updateOne({_id: req.params.for_id}, { $inc: {"votes": -1}, $pull: {"usersVoted": req.user._id}}, function(err, upvotedArg){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/category/"+ req.params.categorySlug + "/" + req.params.slug );
        }
    });
});


module.exports = router;
