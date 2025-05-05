const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    gender: String,
    languages: [{ type: String }],
    password: { type: String, required: true },
    viewed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    liked: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    role: { type: String, enum: ["user", "admin"], default: "user" },
    liked: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    viewed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    watchList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
    interestedGenres: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
