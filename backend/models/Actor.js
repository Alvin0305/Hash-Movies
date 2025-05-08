const mongoose = require("mongoose");

const actorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  debutMovie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
  image: String,
  languages: [{type: String}],
  mostFamousMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

module.exports = mongoose.model("Actor", actorSchema);
