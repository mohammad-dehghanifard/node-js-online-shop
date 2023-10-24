const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_controller");
const {check} = require('express-validator');

router.get("/login",authController.renderLoginPage);
router.post("/login",authController.postLogin)
router.post("/logOut",authController.postLogOut);
router.get("/signup",authController.getSignPage);
router.post("/signup",check("email").isEmail(),authController.postSignUp);
router.get("/resetPass",authController.renderResetPassView);
router.post("/resetPass",authController.sendTokenForResetPassWord);
router.get("/resetPass/:token",authController.renderSetNewPassWordView);
router.post("/save-NewPass",authController.updateResetPassWordInDb);

module.exports = router;