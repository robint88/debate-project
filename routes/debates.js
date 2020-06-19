const express = require('express');
const router = express.Router({mergeParams: true});
const Debate = require('../models/debate');

router.get("/", function(req, res){
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Debate.find({topic: regex}).populate("category").exec(function(err, foundDebates){
            if(err){
                req.flash('error', 'Something went wrong when finding debates');
                res.redirect('back');
            } else {
                var noMatch;
                if(foundDebates.length < 1){
                    noMatch = "Sorry, no debates could be found.";
                }
                res.render('debates/debates', {debates: foundDebates, noMatch: noMatch});
            }
        });
    } else {
        Debate.find({}).sort({createdAt: 'desc'}).populate("category").exec(function(err, foundDebates){

            if(err){
                req.flash('error', 'Something went wrong when finding debates');
                res.redirect('back');
            } else {
                var noMatch;
                res.render('debates/debates', {debates: foundDebates, noMatch: noMatch});
            }
        });
    }
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router