const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    sender: {type: mongoose.Types.ObjectId, ref: "User"},
    review: String,
    opinion: String,
}, {timestamps: true})

const ReviewModel = mongoose.model("Review", ReviewSchema);
module.exports = ReviewModel;