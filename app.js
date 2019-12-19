require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// const draftDebate = [
//     {
//         title: "Money is good.",
//         author: "Adam Smith",
//         content: "Bacon ipsum dolor amet turkey ham hock fatback rump pork kielbasa. Sausage rump pig boudin turducken ground round flank jerky. Shoulder pig jowl bresaola ham pastrami leberkas ribeye. Shoulder short ribs salami, biltong leberkas filet mignon spare ribs sausage. Sirloin burgdoggen tongue pastrami sausage ham hock tenderloin prosciutto."
//     },
//     {
//         title: "Money is bad.",
//         author: "Karl Marx",
//         content: "Bacon ipsum dolor amet turkey ham hock fatback rump pork kielbasa. Sausage rump pig boudin turducken ground round flank jerky. Shoulder pig jowl bresaola ham pastrami leberkas ribeye. Shoulder short ribs salami, biltong leberkas filet mignon spare ribs sausage. Sirloin burgdoggen tongue pastrami sausage ham hock tenderloin prosciutto."
//     }
// ]

//set ejs view engine, body-parser& public directory
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));

// Set up DB
mongoose.connect("mongodb://localhost:27017/debateDB", {useNewUrlParser: true});

const debateSchema = new mongoose.Schema({
    title: String, 
    author: String,
    content: String
});
const DebateArgument = mongoose.model("Debate", debateSchema);

// ROUTES 

// LANDING
app.get("/", function(req, res){
    res.render('index');
});
// INDEX OF DEBATES
app.get("/debates", function(req,res){
    DebateArgument.find(function(err, foundDebates){
        if(err){
            console.log(err);
        } else {
            res.render('debates/debates',{debates: foundDebates});
        }
    });
});
//NEW
app.get("/debates/new", function(req,res){
    res.render("debates/compose");
});
//CREATE
app.post("/debates", function(req,res){
    DebateArgument.create(req.body.debate, function(err, newArg){
        if(err){
            res.render('compose');
        } else {
            res.redirect("/debates");
        }
    });
});

//server
app.listen(3000, function(){
    console.log("*************************************");
    console.log("SERVER RUNNING ON POST 3000! WOOHOO!");
    console.log("*************************************");
});