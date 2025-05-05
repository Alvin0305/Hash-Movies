const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
  image: String,
});

module.exports = mongoose.model("Genre", genreSchema);
