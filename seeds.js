const mongoose = require("mongoose");
const Debate = require('./models/debate');
const Comment = require('./models/comment');
const Argument = require('./models/argument');

const data = [
   {
       topic: "Could the Earth be flat?",
       summary: "Everyone is talking about it. Let's see what these idiots have to say!",
       image: "https://cdn.mos.cms.futurecdn.net/kHGBAaGn2sbVhGnSuFNpQa-970-80.jpg",
       
    
    },
   {
       topic: "Should we be worried about China?",
       summary: "Everyone is talking about it. Let's see what these idiots have to say!",
       image: "https://cdn.mos.cms.futurecdn.net/kHGBAaGn2sbVhGnSuFNpQa-970-80.jpg",
       
    },
   {
       topic: "Is McDonalds bad for you?",
       summary: "Everyone is talking about it. Let's see what these idiots have to say!",
       image: "https://cdn.mos.cms.futurecdn.net/kHGBAaGn2sbVhGnSuFNpQa-970-80.jpg",
       
    
    },
   {
       topic: "Are dogs mans best friend?",
       summary: "Everyone is talking about it. Let's see what these idiots have to say!",
       image: "https://cdn.mos.cms.futurecdn.net/kHGBAaGn2sbVhGnSuFNpQa-970-80.jpg",
       
    
    }
]

function seedDB(){
    //REMOVE ALL DEBATES
    Debate.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("Removed Debates");

        // // CREATE DEBATES
        // data.forEach(function(seed){
        //     Debate.create(seed, function(err, debate){
        //         if(err){
        //             console.log(err);
        //         } else {
        //             console.log("Added debate");
        //             // Create Comment
        //             Argument.create({
        //                 author: "Mr Bones",
        //                 content: "There is a lot to argue about this topic!",
        //             }, function(err, arg){
        //                 if(err){
        //                     console.log(err);
        //                 } else {
        //                     debate.for = arg;
        //                     console.log("Argument created");
        //                 }
        //             });
        //             Argument.create({
        //                 author: "Mrs Bones",
        //                 content: "There isn't a lot to argue about this topic!",
        //             }, function(err, arg){
        //                 if(err){
        //                     console.log(err);
        //                 } else {
        //                     debate.against = arg;
        //                     console.log("Argument created");
        //                 }
        //             });
        //             Comment.create({
        //                 text: "That's so true! You won me over. That other guy however...",
        //                 author: "Mr Sillybones"
        //             }, function(err, comment){
        //                 if(err){
        //                     console.log(err);
        //                 } else {
        //                     debate.comments.push(comment);
        //                     debate.save()
        //                     console.log('Created a comment');
        //                     // console.log(debate);
        //                 }
        //             });
        //         }
        //     }); 
        // });
    });
}

module.exports = seedDB;