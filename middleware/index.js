const Debate = require("../models/debate");
const Comment = require("../models/comment");

const middlewareObj = {};

// middlewareObj.checkDebateOwnership = function(req, res, next){
//     if(req.isAuthenticated()){
//         Debate.findById(req.params.id, function(err, foundDebate){
//             if(err){
//                 res.redirect("back");
//             } else {
//                 if(foundDebate.moderator.id.equals(req.user._id)){
//                     next();
//                 } else {
//                     res.redirect("back");
//                 }
//             }
//         });
//     } else {
//         res.redirect("back");
//     }
// };
// 
//  NEED TO CREATE CHECKDEBATEOWNERSHIP FOR FOR/AGAINST UPDATE ROUTES
// Similar to below??
// 
// middlewareObj.checkDebateOwnership = function(req, res, next){
//     if(req.isAuthenticated()){
//         Debate.findById(req.params.id, function(err, foundDebate){
//             if(err){
//                 req.flash('error', 'Could not find debate');
//                 res.redirect("back");
//             } else {
//                 if(foundDebate.moderator.id.equals(req.user._id)){
//                     next();
//                 } else {
//                     req.flash('error', "You don't have permission to do that");
//                     res.redirect("back");
//                 }
//             }
//         });
//     } else {
//         req.flash('error', 'You need to be logged in to do that');
//         res.redirect("back");
//     }
// };

middlewareObj.checkDebateOwnershipNew = function(req, res, next){
    if(req.isAuthenticated()){
        Debate.findOne({slug: req.params.slug}, function(err, foundDebate){
            if(err){
                req.flash('error', 'Could not find debate');
                res.redirect("back");
            } else {
                if((foundDebate.moderator.id.equals(req.user._id) || req.user.isAdmin)){
                    next();
                } else {
                    req.flash('error', "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash('error', 'You need to be logged in to do that');
        res.redirect("back");
    }
};

middlewareObj.hasAdminAbility = function(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.isAdmin){
            console.log(req.user);
            next();
        } else {
            req.flash('error', "Sorry, you aren't able to do that");
            res.redirect('back');
        }
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash("error", "Please log in to do that.");
        res.redirect("/login");
    }
};

module.exports = middlewareObj;