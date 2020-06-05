const express = require("express");
const mongoose = require('mongoose');
const router = express.Router({mergeParams: true});
const Category = require('../models/categories');
const middleware = require("../middleware");

router.get('/', function(req, res){
    Category.find({}).sort({name: 1}).exec(function(err, foundCat){
        if(err){
            console.log(err);
            res.redirect("/");
        } else {
            res.render("category/index", {categories: foundCat});
        }
    });
});

// New and create
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("category/new");
});
router.post("/", middleware.isLoggedIn, function(req, res){
    Category.create(req.body.category, function(err, newCategory){
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            newCategory.save();
            res.redirect("/category");
        }
    });
});
// Show
router.get("/:categorySlug", function(req, res){
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
// Edit functions for category functions
// ******************************************
// ADD MIDDLEWARE TO CHECK FOR CATEGORY ADMIN
// ******************************************
router.get("/:categorySlug/edit", middleware.isLoggedIn, function(req, res){
    Category.findOne({slug: req.params.categorySlug}, function(err, foundCat){
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            res.render('category/edit', {category: foundCat});
        }
    });
});
router.get("/:categorySlug/removedebate", middleware.isLoggedIn, function(req, res){
    Category.findOne({slug: req.params.categorySlug}).populate('debates').exec(function(err, foundCat){
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            // res.send("THIS WAY");
            res.render('category/removedebate', {category: foundCat});
        }
    });
});
// Update category
// ******************************************
// ADD MIDDLEWARE TO CHECK FOR CATEGORY ADMIN
// ******************************************
router.put("/:categorySlug", middleware.isLoggedIn, function(req, res){
    Category.findOneAndUpdate({slug: req.params.categorySlug}, req.body.category, function(err, updatedCat){
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
        //    console.log(req.body.category.debates);
           updatedCat.debates.pull(req.body.category.debates);
            res.redirect('/category/' + req.params.categorySlug);
        }
    });
});
// REMOVE DEBATE
router.put("/removedebate/:categorySlug", middleware.isLoggedIn, function(req, res){
    Category.updateOne({slug: req.params.categorySlug},{$pull: {"debates": req.body.category.debates}}, function(err, updatedCat){
       if(err){
           console.log(err);
       } else {
           res.redirect('/category/' + req.params.categorySlug);
       }
   });
});
// Remove Category
router.delete("/:categorySluf", middleware.isLoggedIn, function(req,res){
    Category.findByIdAndRemove(req.params.categorySluf, function(err){
        if(err){
            res.redirect("/debates");
            console.log(err);
        } else {
            res.redirect("/category");
        }
        
    });
});

module.exports = router;

