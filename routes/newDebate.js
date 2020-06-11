const express = require("express");
const router = express.Router({mergeParams: true});
const Debate = require("../models/debate");
const Category = require("../models/categories");
const middleware = require("../middleware");

// INDEX OF DEBATES
router.get("/", function(req,res){
    Category.findOne({slug: req.params.categorySlug}).populate('debates').exec(function(err, foundCat){
        console.log(foundCat);
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            res.render('category/show', {category: foundCat});
        }
    });
});
//NEW
router.get("/new", middleware.isLoggedIn,function(req,res){
    Category.find({}).sort({name: 1}).exec(function(err, foundCategories){
        if(err){
            res.res('back');
        } else {
            res.render("debates/compose", {categories: foundCategories, category_slug: req.params.categorySlug});

        }
    });
    
});
//CREATE
router.post("/", middleware.isLoggedIn, function(req,res){
    Debate.create(req.body.debate, function(err, newDebate){
        if(err){
            res.render('debates/compose');
        } else {
            
            newDebate.moderator.username = req.user.username;
            newDebate.moderator.id = req.user._id;

            Category.findById(req.body.debate.category, function(err, foundCat){
                foundCat.debates.push(newDebate);
                foundCat.save();   
            });
            newDebate.save();
            res.redirect("/category/"+ req.params.categorySlug + "/" + newDebate.slug);
        }
    });
}); 
// SHOW
router.get("/:slug", function(req, res){
        Debate.findOne({slug: req.params.slug}).populate('comments for against category').exec(function(err, foundDebate){
            if(err){
                res.redirect("/debates");
                console.log(err);
            } else {
                // console.log(foundDebate);
                // NEED TO FIND AND UPDATE CATEGORY TOO
                res.render("debates/show", {debate: foundDebate, category_slug: req.params.categorySlug});
            }
        });  
});
// EDIT

// ADD AUTHENTICATION MIDDLEWARE TO EDIT AND UPDATE!
router.get("/:slug/edit", middleware.checkDebateOwnershipNew, function(req,res){
    Debate.findOne({slug: req.params.slug}, function(err, foundArg){
        console.log(foundArg);
        if(err){
            res.redirect("/category/");
            console.log(err);
        } else {
            Category.find({}).populate('categories').sort({name: 1}).exec(function(err, foundCategories){
                if(err){
                    console.log(err);
                } else {
                    res.render("debates/edit", {debate: foundArg, categories: foundCategories, category_slug: req.params.categorySlug});
                }
            })
            
        }
    });
});
// UPDATE
router.put("/:slug", middleware.checkDebateOwnershipNew, function(req,res){
    Debate.findOneAndUpdate({slug: req.params.slug}, req.body.debate, function(err, updatedDebate){
        if(err){
            req.flash('error', 'Something went wrong.');
            res.redirect("/category/" + req.params.categorySlug);
            console.log(err);
        } else {
            // FIND CATEGORY AND PUSH NEW CATEGORY IN TO IT AND REMOVE OLD
            // Doesnt work properly - allows multiple entries of same debate in one category
            req.flash('success', 'Debate updated');
            res.redirect("/category/" + req.params.categorySlug + "/" + updatedDebate.slug);
            
            
        }
    });
});
// Publish Debate
router.put("/:slug/publish", middleware.checkDebateOwnershipNew, function(req, res){
    Debate.updateOne({slug: req.params.slug},{$set: {isPublished: req.body.debate.isPublished}}, function(err, foundDebate){
        if(err){
            console.log(err);
        } else {
            res.redirect('/category' + req.params.categorySlug);
        }
    });
});

// DESTROY
router.delete("/:slug", middleware.checkDebateOwnershipNew, function(req,res){
    Debate.findOneAndRemove({slug: req.params.slug}, function(err){
        if(err){
            res.redirect("/category/" + req.params.categorySlug);
            console.log(err);
        } else {
            req.flash('success', 'Debate deleted');
            res.redirect("/category/" + req.params.categorySlug);
        }
        
    });
});


module.exports = router;