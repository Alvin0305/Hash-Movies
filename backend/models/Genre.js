const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
});

module.exports = mongoose.model("Genre", genreSchema);
