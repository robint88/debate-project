const express = require("express");
const router = express.Router({mergeParams: true});
const Debate = require('../models/debate');
const Comment = require('../models/comment');
const middleware = require("../middleware");

//New
router.get("/new", middleware.isLoggedIn, function(req, res){
    Debate.findOne({slug: req.params.slug}, function(err, foundDebate){
        if(err){
            console.log(err);
        } else {
            res.locals.title = "New comment";
            res.render("discussion/new", {debate: foundDebate});
        }
    });
});

//Create
router.post("/", middleware.isLoggedIn, function(req, res){
    Debate.findOne({slug: req.params.slug}, function(err, foundDebate){
        if(err){
            console.log(err);
            res.redirect("/category/"+ req.params.categorySlug+ "/" + req.params.slug);
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash('error', 'Something went wrong');
                    res.redirect('back');
                } else {
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    comment.save();

                    foundDebate.comments.push(comment);
                    foundDebate.save();
                    
                    req.flash('success', 'Added new comment');
                    res.json(comment);
                    // res.redirect("/debates/"+ foundDebate._id);
                }
            })
        }
    });
});
// Edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.locals.title = "Edit comment";
            res.render("discussion/edit", {category_slug: req.params.categorySlug, debate_slug: req.params.slug, comment: foundComment});
        }
    });
});
//Update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, {new: true}, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            // console.log("Updated comment");
            // res.redirect("/debates/" + req.params.id);  
            req.flash('success', 'Updated comment');
            res.json(updatedComment);
        }
        
    });
});

// Destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, commentToDelete){
        if(err){
            res.redirect("back");
        } else {
            // console.log("DELETED COMMENT");
            // res.redirect("/debates/" + req.params.id);
            req.flash('success', 'Comment deleted');
            res.json(commentToDelete);
        }
    })
});


module.exports = router;