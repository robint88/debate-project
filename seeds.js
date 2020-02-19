const mongoose = require("mongoose");
const Debate = require('./models/debate');
const Comment = require('./models/comment');

const data = [
   {
       topic: "Could the Earth be flat?",
       summary: "Everyone is talking about it. Let's see what these idiots have to say!",
       image: "https://cdn.mos.cms.futurecdn.net/kHGBAaGn2sbVhGnSuFNpQa-970-80.jpg",
       for: {
            author: "Some old guy",
            content: "Are creatures of the cosmos. Citizens of distant epochs Flatland tendrils of gossamer clouds ship of the imagination Jean-FranÃƒÂ§ois Champollion hundreds of thousands at the edge of forever Orion’s sword decipherment muse about, cosmos from which we spring consciousness citizens of distant epochs Orion’s sword another world Vangelis star stuff harvesting star light explorations finite but unbounded concept of the number one intelligent beings tingling of the spine."
        },
    against: {
            author: "Some modern guy",
            content: "Are creatures of the cosmos. Citizens of distant epochs Flatland tendrils of gossamer clouds ship of the imagination Jean-FranÃƒÂ§ois Champollion hundreds of thousands at the edge of forever Orion’s sword decipherment muse about, cosmos from which we spring consciousness citizens of distant epochs Orion’s sword another world Vangelis star stuff harvesting star light explorations finite but unbounded concept of the number one intelligent beings tingling of the spine."
        }
    },
   {
       topic: "Should we be worried about China?",
       summary: "Everyone is talking about it. Let's see what these idiots have to say!",
       image: "https://cdn.mos.cms.futurecdn.net/kHGBAaGn2sbVhGnSuFNpQa-970-80.jpg",
       for: {
            author: "Some ok guy",
            content: "Are creatures of the cosmos. Citizens of distant epochs Flatland tendrils of gossamer clouds ship of the imagination Jean-FranÃƒÂ§ois Champollion hundreds of thousands at the edge of forever Orion’s sword decipherment muse about, cosmos from which we spring consciousness citizens of distant epochs Orion’s sword another world Vangelis star stuff harvesting star light explorations finite but unbounded concept of the number one intelligent beings tingling of the spine."
        },
    against: {
            author: "Some stupid guy",
            content: "Are creatures of the cosmos. Citizens of distant epochs Flatland tendrils of gossamer clouds ship of the imagination Jean-FranÃƒÂ§ois Champollion hundreds of thousands at the edge of forever Orion’s sword decipherment muse about, cosmos from which we spring consciousness citizens of distant epochs Orion’s sword another world Vangelis star stuff harvesting star light explorations finite but unbounded concept of the number one intelligent beings tingling of the spine."
        }
    },
   {
       topic: "Is McDonalds bad for you?",
       summary: "Everyone is talking about it. Let's see what these idiots have to say!",
       image: "https://cdn.mos.cms.futurecdn.net/kHGBAaGn2sbVhGnSuFNpQa-970-80.jpg",
       for: {
            author: "Some old guy",
            content: "Are creatures of the cosmos. Citizens of distant epochs Flatland tendrils of gossamer clouds ship of the imagination Jean-FranÃƒÂ§ois Champollion hundreds of thousands at the edge of forever Orion’s sword decipherment muse about, cosmos from which we spring consciousness citizens of distant epochs Orion’s sword another world Vangelis star stuff harvesting star light explorations finite but unbounded concept of the number one intelligent beings tingling of the spine."
        },
    against: {
            author: "Some modern guy",
            content: "Are creatures of the cosmos. Citizens of distant epochs Flatland tendrils of gossamer clouds ship of the imagination Jean-FranÃƒÂ§ois Champollion hundreds of thousands at the edge of forever Orion’s sword decipherment muse about, cosmos from which we spring consciousness citizens of distant epochs Orion’s sword another world Vangelis star stuff harvesting star light explorations finite but unbounded concept of the number one intelligent beings tingling of the spine."
        }
    },
   {
       topic: "Are dogs mans best friend?",
       summary: "Everyone is talking about it. Let's see what these idiots have to say!",
       image: "https://cdn.mos.cms.futurecdn.net/kHGBAaGn2sbVhGnSuFNpQa-970-80.jpg",
       for: {
            author: "Doc",
            content: "Did you hurt your head? Okay, alright, I’ll prove it to you. Look at my driver’s license, expires 1987. Look at my birthday, for crying out load I haven’t even been born yet. And, look at this picture, my brother, my sister, and me. Look at the sweatshirt, Doc, class of 1984. Oh. Actually, people call me Marty. Uh no, not hard at all. So anyway, George, now Lorraine, she really likes you. She told me to tell you that she wants you to ask her to the Enchantment Under The Sea Dance."
        },
    against: {
            author: "Marty",
            content: "Did you hurt your head? Okay, alright, I’ll prove it to you. Look at my driver’s license, expires 1987. Look at my birthday, for crying out load I haven’t even been born yet. And, look at this picture, my brother, my sister, and me. Look at the sweatshirt, Doc, class of 1984. Oh. Actually, people call me Marty. Uh no, not hard at all. So anyway, George, now Lorraine, she really likes you. She told me to tell you that she wants you to ask her to the Enchantment Under The Sea Dance."
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