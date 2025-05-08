const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.delete("/:id", userController.deleteUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.get("/:id/watchList", userController.getWatchList);
router.put("/viewed/add/:id", userController.addToViewed);
router.put("/viewed/remove/:id", userController.removeFromViewed);
router.put("/liked/add/:id", userController.addToLiked);
router.put("/liked/remove/:id", userController.removeFromLiked);
router.put("/watchlist/add/:id", userController.addToWatchList);
router.put("/watchlist/remove/:id", userController.removeFromWatchList);

module.exports = router;
