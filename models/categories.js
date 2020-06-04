const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
    name: String,
    debates: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Debate"
        }
    ],
    slug: {
        type: String,
        required: true,
        unique: true
    },
    image: String
});

categorySchema.pre('validate', function(next){
    if(this.name){
        this.slug = slugify(this.name, {lower: true, strict: true});
    }
    next();
});


module.exports = mongoose.model("Category", categorySchema);