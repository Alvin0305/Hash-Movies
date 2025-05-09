const express = require("express");
const router = express.Router();
const genreController = require("../controllers/genreController");
const upload = require("../middlewares/upload");

router.get("/", genreController.getAllGenres);
router.get("/:id", genreController.getGenreById);
router.post("/", upload.single("image"), genreController.createGenre);
router.put("/:id", genreController.updateGenre);
router.delete("/:id", genreController.deleteGenre);

module.exports = router;
