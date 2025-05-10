const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
// const movieRoutes = require("./movieRoutes");
// const actorRoutes = require("./actorRoutes");
// const genreRoutes = require("./genreRoutes");
// const platformRoutes = require("./platformRoutes");
// const reviewRoutes = require("./reviewRoutes");
// const userRoutes = require("./userRoutes");

router.use("/auth", authRoutes);
// router.use("/movies", movieRoutes);
// router.use("/actors", actorRoutes);
// router.use("/genres", genreRoutes);
// router.use("/platforms", platformRoutes);
// router.use("/reviews", reviewRoutes);
// router.use("/users", userRoutes);

module.exports = router;
