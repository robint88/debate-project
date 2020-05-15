const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: String,
    debates: []
});

module.exports = mongoose.model("Category", categorySchema);