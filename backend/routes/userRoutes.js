const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.delete("/:id", userController.deleteUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.get("/:id/watchList", userController.getWatchList);

module.exports = router;