const mongoose = require('mongoose');

const debateSchema = new mongoose.Schema({
    topic: String,
    summary: String,
    for: {
        author: String,
        content: String,
        factScore: Number,
        votes: Number
    },
    against: {
        author: String,
        content: String,
        factScore: Number,
        votes: Number
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
module.exports = mongoose.model("Debate", debateSchema);
