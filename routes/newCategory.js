const express = require("express");
const mongoose = require('mongoose');
const router = express.Router({mergeParams: true});
const Category = require('../models/categories');
const middleware = require("../middleware");

router.get('/', function(req, res){
    Category.find({}).sort({name: 1}).exec(function(err, foundCat){
        if(err){
            req.flash('error', 'Something went wrong');
            res.redirect("/");
        } else {
            res.locals.title = "Categories";
            res.render("category/index", {categories: foundCat});
        }
    });
});

// New and create
router.get("/new", middleware.hasAdminAbility, function(req, res){
    res.locals.title = "Add new category";
    res.render("category/new");
});
router.post("/", middleware.hasAdminAbility, function(req, res){
    Category.create(req.body.category, function(err, newCategory){
        if(err){
            req.flash('error', 'Something went wrong');
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
            req.flash('error', 'Something went wrong when finding that category');
            res.redirect('back');
        } else {
            res.locals.title = foundCat.name;
            res.render('category/show', {category: foundCat});
        }
    });
});
// Edit functions for category functions
// ******************************************
// ADD MIDDLEWARE TO CHECK FOR CATEGORY ADMIN
// ******************************************
router.get("/:categorySlug/edit", middleware.hasAdminAbility, function(req, res){
    Category.findOne({slug: req.params.categorySlug}, function(err, foundCat){
        if(err){
            req.flash('error', 'Something went wrong');
            res.redirect('back');
        } else {
            res.locals.title = "Edit category";
            res.render('category/edit', {category: foundCat});
        }
    });
});
router.get("/:categorySlug/removedebate", middleware.hasAdminAbility, function(req, res){
    Category.findOne({slug: req.params.categorySlug}).populate('debates').exec(function(err, foundCat){
        if(err){
            req.flash('error', 'Something went wrong');
            res.redirect('back');
        } else {
            // res.send("THIS WAY");
            res.locals.title = "Remove debate";
            res.render('category/removedebate', {category: foundCat});
        }
    });
});
// Update category
// ******************************************
// ADD MIDDLEWARE TO CHECK FOR CATEGORY ADMIN
// ******************************************
router.put("/:categorySlug", middleware.hasAdminAbility, function(req, res){
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
router.put("/removedebate/:categorySlug", middleware.hasAdminAbility, function(req, res){
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

