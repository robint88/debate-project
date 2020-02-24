const express = require("express");
const router = express.Router({mergeParams: true});
const Debate = require('../models/debate');
const Comment = require('../models/comment');

//New
router.get("/new", isLoggedIn, function(req, res){
    Debate.findById(req.params.id, function(err, foundDebate){
        if(err){
            console.log(err);
        } else {
            res.render("discussion/new", {debate: foundDebate});
        }
    });
});

//Create
router.post("/", isLoggedIn, function(req, res){
    Debate.findById(req.params.id, function(err, foundDebate){
        if(err){
            console.log(err);
            res.redirect("/debates");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    comment.save();

                    foundDebate.comments.push(comment);
                    foundDebate.save();
                    
                    res.redirect("/debates/"+ foundDebate._id);
                }
            })
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