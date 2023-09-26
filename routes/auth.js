const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_controller");

router.get("/login",authController.renderLoginPage);
router.post("/login",authController.postLogin)

module.exports = router;