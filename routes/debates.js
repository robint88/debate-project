const express = require("express");
const router = express.Router();
const Debate = require("../models/debate");
const Category = require("../models/categories");

// INDEX OF DEBATES
router.get("/", function(req,res){
    Debate.find({}).sort({createdAt: 'desc'}).exec(function(err, foundDebates){
        if(err){
            console.log(err);
        } else {
            res.render('debates/debates',{debates: foundDebates});
        }
    });
});
//NEW
router.get("/new", isLoggedIn,function(req,res){
    Category.find({}).sort({name: 1}).exec(function(err, foundCategories){
        if(err){
            console.log(err);
        } else {
            res.render("debates/compose", {categories: foundCategories});

        }
    });
    
});
//CREATE
router.post("/", isLoggedIn, function(req,res){
    Debate.create(req.body.debate, function(err, newArg){
        if(err){
            res.render('debates/compose');
            console.log(err);
        } else {
            newArg.moderator.username = req.user.username;
            newArg.moderator.id = req.user._id;
            newArg.save();

            Category.findOne({name: newArg.category}, function(err, foundCat){
                foundCat.debates.push(newArg);
                foundCat.save();
            });

            res.redirect("/debates/" + newArg._id);
        }
    });
});
// SHOW
router.get("/:id", function(req, res){
    Debate.findById(req.params.id).populate('comments for against').exec(function(err, foundDebate){
        if(err){
            res.redirect("/debates");
            console.log(err);
        } else {
            // console.log(foundDebate);
            res.render("debates/show", {debate: foundDebate});
        }
    });
});
// EDIT
// POPULATING THE DEBATE ARGUMENTS WITH FOR AND AGAINST DATA - NEED TO FIX USER INFO THOUGH
router.get("/:id/edit", checkDebateOwnership, function(req,res){
    Debate.findById(req.params.id).populate('for against').exec(function(err, foundArg){
        if(err){
            res.redirect("/debates");
            console.log(err);
        } else {
            res.render("debates/edit", {debate: foundArg});
        }
    });
});
// UPDATE
router.put("/:id", checkDebateOwnership, function(req,res){
    Debate.findByIdAndUpdate(req.params.id, req.body.debate, function(err, updatedArg){
        console.log(updatedArg);
        if(err){
            res.redirect("/debates");
            console.log(err);
        } else {
            res.redirect("/debates/" + req.params.id);
        }
    });
});
// DESTROY
router.delete("/:id", checkDebateOwnership, function(req,res){
    Debate.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/debates");
            console.log(err);
        } else {
            res.redirect("/debates");
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

function checkDebateOwnership(req, res, next){
    if(req.isAuthenticated()){
        Debate.findById(req.params.id, function(err, foundDebate){
            if(err){
                res.redirect("back");
            } else {
                if(foundDebate.moderator.id.equals(req.user._id)){
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