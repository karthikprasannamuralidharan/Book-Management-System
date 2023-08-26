const mongoose = require("mongoose");

//Schema
const BookSchema = mongoose.Schema({
    ISBN : String,
    title: String,
    pubDate: String,
    language : String,
    numPage: Number,
    author: [Number],
    publications: Number,
    category: [String]
});

//Create a model
const BookModel = mongoose.model("books", BookSchema);

module.exports = BookModel;