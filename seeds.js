const mongoose = require("mongoose");
const Debate = require('./models/debate');
const Comment = require('./models/comment');

const data = [
   {
       topic: "The Earth is flat",
       for: {
            title: "The Earth is flat",
            author: "Some old guy",
            content: "Are creatures of the cosmos. Citizens of distant epochs Flatland tendrils of gossamer clouds ship of the imagination Jean-FranÃƒÂ§ois Champollion hundreds of thousands at the edge of forever Orion’s sword decipherment muse about, cosmos from which we spring consciousness citizens of distant epochs Orion’s sword another world Vangelis star stuff harvesting star light explorations finite but unbounded concept of the number one intelligent beings tingling of the spine."
        },
    against: {
            title: "The Earth is round",
            author: "Some modern guy",
            content: "Are creatures of the cosmos. Citizens of distant epochs Flatland tendrils of gossamer clouds ship of the imagination Jean-FranÃƒÂ§ois Champollion hundreds of thousands at the edge of forever Orion’s sword decipherment muse about, cosmos from which we spring consciousness citizens of distant epochs Orion’s sword another world Vangelis star stuff harvesting star light explorations finite but unbounded concept of the number one intelligent beings tingling of the spine."
        }
    }
]

function seedDB(){
    //REMOVE ALL DEBATES
    Debate.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("Removed Debates");

        // CREATE DEBATES
        data.forEach(function(seed){
            Debate.create(seed, function(err, debate){
                if(err){
                    console.log(err);
                } else {
                    console.log("Added debate");
                    // Create Comment
                    Comment.create({
                        text: "That's so true! You won me over. That other guy however...",
                        author: "Mr Sillybones"
                    }, function(err, comment){
                        if(err){
                            console.log(err);
                        } else {
                            debate.comments.push(comment);
                            debate.save()
                            console.log('Created a comment');
                            console.log("Comment is: " + comment.text);
                        }
                    });
                }
            }); 
        });
    });
}

module.exports = seedDB;