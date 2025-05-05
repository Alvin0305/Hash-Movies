const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get("/", movieController.getAllMovies);
router.get("/featured", movieController.getFeaturedMovies);
router.get("genre/:genreId", movieController.getMovieByGenre);
router.get("/:id", movieController.getMovieById);
router.post("/", movieController.createMovie);
router.put("/:id", movieController.updateMovie);
router.delete("/:id", movieController.deleteMovie);
router.patch("/:id/like", movieController.likeMovie);

module.exports = router;