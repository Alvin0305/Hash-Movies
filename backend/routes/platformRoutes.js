const express = require("express");
const router = express.Router();
const platformController = require("../controllers/platformController");

router.get("/", platformController.getAllPlatforms);
router.get("/search", platformController.searchPlatforms);
router.get("/:id", platformController.getPlatformById);
router.get("/:id/movies", platformController.getPlatformMovies);
router.post("/", platformController.createPlatform);
router.put("/:id", platformController.updatePlatform);
router.delete("/:id", platformController.deletePlatform);

module.exports = router;
