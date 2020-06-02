const mongoose = require('mongoose');

const argumentSchema = new mongoose.Schema({
    author: String,
    content: String,
    factScore: Number,
    votes: {type: Number, default: 0},
    usersVoted: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

module.exports = mongoose.model("Argument", argumentSchema);