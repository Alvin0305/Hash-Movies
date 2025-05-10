const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    director: String,
    releaseDate: Date,
    genres: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],
    image: String,
    cloudinaryPublicId: String,
    actors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Actor" }],
    duration: Number,
    storyline: String,
    language: String,
    certificate: { type: String, enum: ["U", "A", "UA"] },
    likes: { type: Number, default: 0 },
    rating: { type: Number },
    platforms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Platform" }],
    trailer: String,
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
