const mongoose = require('mongoose');

const argumentSchema = new mongoose.Schema({
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    content: String,
    factScore: Number,
    votes: Number,
    usersVoted: []
});

module.exports = mongoose.model("Argument", argumentSchema);