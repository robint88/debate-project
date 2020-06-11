const express = require('express');
const router = express.Router({mergeParams: true});
const Debate = require('../models/debate');

router.get("/", function(req, res){
    Debate.find({isPublished: "true"}).sort({createdAt: 'desc'}).populate("category").exec(function(err, foundDebates){
        if(err){
            req.flash('error', 'Something went wrong when finding debates');
            res.redirect('back');
        } else {
            res.render('debates/debates', {debates: foundDebates});
        }
    });
});

module.exports = router