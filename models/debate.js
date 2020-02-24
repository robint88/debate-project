const mongoose = require('mongoose');

const debateSchema = new mongoose.Schema({
    topic: String,
    summary: String,
    image: String,
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
    ],
    moderator: {
        id: {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        },
        username: String
    }
});
module.exports = mongoose.model("Debate", debateSchema);
