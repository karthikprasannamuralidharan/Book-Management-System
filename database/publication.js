const mongoose = require("mongoose");

//Schema
const PublicationSchema = mongoose.Schema({
    id: Number,
    name: String,
    books: [String]
});

//Create a model
const PublicationModel = mongoose.model("publications", PublicationSchema);

module.exports = PublicationModel;