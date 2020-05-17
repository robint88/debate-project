const mongoose = require('mongoose');

const debateSchema = new mongoose.Schema({
    topic: String,
    summary: String,
    image: String,
    for:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Argument"
    },
    against: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Argument"
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
    },
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Debate", debateSchema);
