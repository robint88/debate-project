const express = require("express");
const router = express.Router({mergeParams: true});
const Debate = require('../models/debate');
const Argument = require("../models/argument");

router.get("/new", isLoggedIn, function(req, res){
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
});
// Edit
router.get("/:against_id/edit", function(req, res){
    Argument.findById(req.params.against_id, function(err, foundArg){
        if(err){
            res.redirect("back");
        } else {
            res.render("against/edit", {debate_id: req.params.id, againstArg: foundArg});
        }
    });
});

router.put("/:against_id", function(req, res){
    Argument.findByIdAndUpdate(req.params.against_id, req.body.against, function(err, updateArg){
        if(err){
            res.redirect("back");
        } else {
            console.log("Updated against arg");
            res.redirect("/debates/" + req.params.id);  
        }
        
    });
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
};

module.exports = router;