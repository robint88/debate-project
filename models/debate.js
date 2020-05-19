const mongoose = require('mongoose');
const slugify = require('slugify');

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
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    createdAt: {type: Date, default: Date.now},
    slug: {
        type: String,
        required: true,
        unique: true
    }
});

debateSchema.pre('validate', function(next){
    if(this.topic){
        this.slug = slugify(this.topic, {lower: true, strict: true});
    }
    next();
});

module.exports = mongoose.model("Debate", debateSchema);
