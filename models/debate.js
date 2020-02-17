const mongoose = require('mongoose');

const debateSchema = new mongoose.Schema({
    title: String, 
    author: String,
    content: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
module.exports = mongoose.model("Debate", debateSchema);
