const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
    topic: String,
    createdAt:{type: Date, default: Date.now},
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model('Suggestion', suggestionSchema)