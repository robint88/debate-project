const express = require("express");
const router = express.Router();
const Debate = require("../models/debate");

// INDEX OF DEBATES
router.get("/", function(req,res){
    Debate.find(function(err, foundDebates){
        if(err){
            console.log(err);
        } else {
            res.render('debates/debates',{debates: foundDebates});
        }
    });
});
//NEW
router.get("/new", function(req,res){
    res.render("debates/compose");
});
//CREATE
router.post("/", function(req,res){
    Debate.create(req.body.debate, function(err, newArg){
        if(err){
            res.render('compose');
        } else {
            res.redirect("/debates/" + newArg._id);
        }
    });
});
// SHOW
router.get("/:id", function(req, res){
    Debate.findById(req.params.id).populate("comments").exec(function(err, foundArg){
        if(err){
            res.redirect("/debates");
            console.log(err);
        } else {
            res.render("debates/show", {debate: foundArg});
        }
    });
});
// EDIT
router.get("/:id/edit", function(req,res){
    Debate.findById(req.params.id, function(err, foundArg){
        if(err){
            res.redirect("/debates");
            console.log(err);
        } else {
            res.render("debates/edit", {debate: foundArg});
        }
    });
});
// UPDATE
router.put("/:id", function(req,res){
    Debate.findByIdAndUpdate(req.params.id, req.body.debate, function(err, updatedArg){
        if(err){
            res.redirect("/debates");
            console.log(err);
        } else {
            res.redirect("/debates/" + req.params.id);
        }
    });
});
// DESTROY
router.delete("/:id", function(req,res){
    Debate.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/debates");
            console.log(err);
        } else {
            res.redirect("/debates");
        }
        
    });
});

module.exports = router;