const express = require("express");
const router = express.Router();
const actorController = require("../controllers/actorController");
const upload = require("../middlewares/upload");
const parseFormData = require("../middlewares/upload");

router.get("/", actorController.getAllActors);
router.get("/search", actorController.searchActor);
router.get("/:id", actorController.getActorById);
router.get("/:id/movies", actorController.getActorMovies);
router.post("/", upload.single("image"), actorController.createActor);
router.put("/:id", actorController.updateActor);
router.delete("/:id", actorController.deleteActor);

module.exports = router;
