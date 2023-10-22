const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_controller");

router.get("/login",authController.renderLoginPage);
router.post("/login",authController.postLogin)
router.post("/logOut",authController.postLogOut);
router.get("/signup",authController.getSignPage);
router.post("/signup",authController.postSignUp);
router.get("/resetPass",authController.renderResetPassView);
router.post("/resetPass",authController.sendTokenForResetPassWord);

module.exports = router;