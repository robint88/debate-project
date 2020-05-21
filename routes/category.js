const express = require('express');
const router = express.Router();
const Category = require('../models/categories');
const Debate = require('../models/debate');

router.get("/", function(req, res){
    Category.find({}).sort({name: 1}).exec(function(err, foundCat){
        if(err){
            console.log(err);
            res.redirect("/");
        } else {
            res.render("category/index", {categories: foundCat});
        }
    });
});

router.get("/new", function(req, res){
    res.render("category/new");
});
router.post("/", function(req, res){
    Category.create(req.body.category, function(err, newCategory){
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            newCategory.save();
            res.redirect("/categories");
        }
    });
});
router.get("/:categoryId", function(req, res){
    Category.findById(req.params.categoryId).populate('debates').exec(function(err, foundCat){
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            res.render('category/show', {category: foundCat});
        }
    });
});
// ******************************************
// ADD MIDDLEWARE TO CHECK FOR CATEGORY ADMIN
// ******************************************
router.get("/:categoryId/edit", function(req, res){
    Category.findById(req.params.categoryId, function(err, foundCat){
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            res.render('category/edit', {category: foundCat});
        }
    });
});
router.get("/:categoryId/removedebate", function(req, res){
    Category.findById(req.params.categoryId).populate('debates').exec(function(err, foundCat){
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            // res.send("THIS WAY");
            res.render('category/removedebate', {category: foundCat});
        }
    });
});
// ******************************************
// ADD MIDDLEWARE TO CHECK FOR CATEGORY ADMIN
// ******************************************
router.put("/:categoryId", function(req, res){
    Category.findByIdAndUpdate(req.params.categoryId, req.body.category, function(err, updatedCat){
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
        //    console.log(req.body.category.debates);
           updatedCat.debates.pull(req.body.category.debates);
            res.redirect('/categories/' + req.params.categoryId);
        }
    });
});
// REMOVE DEBATE
router.put("/removedebate/:categoryId", function(req, res){
     Category.updateOne({_id: req.params.categoryId},{$pull: {"debates": req.body.category.debates}}, function(err, updatedCat){
        if(err){
            console.log(err);
        } else {
            res.redirect('/categories/' + req.params.categoryId);
        }
    });
})

router.delete("/:catid", function(req,res){
    Category.findByIdAndRemove(req.params.catid, function(err){
        if(err){
            res.redirect("/debates");
            console.log(err);
        } else {
            res.redirect("/categories");
        }
        
    });
});
module.exports = router;