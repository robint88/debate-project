const mongoose = require('mongoose');

const argumentSchema = new mongoose.Schema({
    author: String,
    content: String,
    factScore: Number,
    votes: Number,
    usersVoted: []
});

module.exports = mongoose.model("Argument", argumentSchema);