const mongoose = require("mongoose");

//Schema
const AuthorSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String],
});

//Create a model
const AuthorModel = mongoose.model("authors", AuthorSchema);

module.exports = AuthorModel;