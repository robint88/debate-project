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
                    
                    res.json(comment);
                    // res.redirect("/debates/"+ foundDebate._id);
                }
            })
        }
    });
});
// Edit
router.get("/:comment_id/edit", checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("discussion/edit", {debate_id: req.params.id, comment: foundComment});
        }
    });
});
//Update
router.put("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, {new: true}, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            // console.log("Updated comment");
            // res.redirect("/debates/" + req.params.id);  
            res.json(updatedComment);
        }
        
    });
});

// Destroy
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, commentToDelete){
        if(err){
            res.redirect("back");
        } else {
            // console.log("DELETED COMMENT");
            // res.redirect("/debates/" + req.params.id);
            res.json(commentToDelete);
        }
    })
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
};

function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;