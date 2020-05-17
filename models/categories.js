const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: String,
    debates: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Debate"
        }
    ]
});

module.exports = mongoose.model("Category", categorySchema);