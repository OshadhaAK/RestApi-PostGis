const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const UserController = require('../controllers/users')


router.get("/", checkAuth, UserController.get_all_users);

router.get("/:id", checkAuth, UserController.filter_user);

router.post("/", checkAuth, UserController.post_user);

router.patch("/:id", checkAuth, UserController.update_user);

router.delete("/:id", checkAuth, UserController.delete_user);

router.post("/signup", UserController.user_signup);

router.post("/signin", UserController.user_signin);

module.exports = router;