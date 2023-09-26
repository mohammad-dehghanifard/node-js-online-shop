const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_controller");

router.get("/login",authController.renderLoginPage);

module.exports = router;