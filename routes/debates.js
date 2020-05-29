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
    Debate.create(req.body.debate, function(err, newDebate){
        if(err){
            res.render('debates/compose');
            console.log(err);
        } else {
            
            newDebate.moderator.username = req.user.username;
            newDebate.moderator.id = req.user._id;
            

            Category.findById(req.body.debate.category, function(err, foundCat){
                foundCat.debates.push(newDebate);
                foundCat.save();   
            });
            console.log(newDebate);
            newDebate.save();
            res.redirect("/debates/" + newDebate._id);
        }
    });
}); 
// SHOW
router.get("/:id", function(req, res){
        Debate.findById(req.params.id).populate('comments for against category').exec(function(err, foundDebate){
            if(err){
                res.redirect("/debates");
                console.log(err);
            } else {
                // console.log(foundDebate);
                // NEED TO FIND AND UPDATE CATEGORY TOO
                res.render("debates/show", {debate: foundDebate});
            }
        });  
});
// EDIT

// ADD AUTHENTICATION MIDDLEWARE TO EDIT AND UPDATE!
router.get("/:id/edit", checkDebateOwnership, function(req,res){
    Debate.findById(req.params.id, function(err, foundArg){
        if(err){
            res.redirect("/debates");
            console.log(err);
        } else {
            Category.find({}).populate('categories').exec(function(err, foundCategories){
                if(err){
                    console.log(err);
                } else {
                    res.render("debates/edit", {debate: foundArg, categories: foundCategories});
                }
            })
            
        }
    });
});
// UPDATE
router.put("/:id", checkDebateOwnership, function(req,res){
    Debate.findByIdAndUpdate(req.params.id, req.body.debate, function(err, updatedDebate){
        if(err){
            res.redirect("/debates");
            console.log(err);
        } else {
            // FIND CATEGORY AND PUSH NEW CATEGORY IN TO IT AND REMOVE OLD
            // Doesnt work properly - allows multiple entries of same debate in one category
           
            // const updatedCat = req.body.debate.category;
            Category.findById(req.body.debate.category, function(err, foundCat){
                if(err){
                    console.log(err);
                } else {
                    foundCat.debates.push(updatedDebate);
                    foundCat.save();
                }
            });
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