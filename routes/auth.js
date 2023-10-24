const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth_controller");
const {body} = require('express-validator');

router.get("/login",authController.renderLoginPage);
router.post("/login",authController.postLogin)
router.post("/logOut",authController.postLogOut);
router.get("/signup",authController.getSignPage);
// post user information and signup user
router.post(
    "/signup",
    [
      body("email","ایمیل وارد شده معتبر نمیباشد! لطفا یک ایمیل معتبر وارد کنید").isEmail(),
      body("passWord","رمزعبور باید شامل حروف و اعداد انگلیسی و حداقل 5 کاراکتر باشد").isLength({min:5}).isAlphanumeric(),
      body("confirmPassWord").custom(
       (value,{req}) => {
        if(value !== req.body.passWord){
            throw new Error('تکرار رمز عبور با رمزعبور اصلی یکسان نمیباشد');
        }
        return true;
       }
      )
    ],
    authController.postSignUp);
router.get("/resetPass",authController.renderResetPassView);
router.post("/resetPass",authController.sendTokenForResetPassWord);
router.get("/resetPass/:token",authController.renderSetNewPassWordView);
router.post("/save-NewPass",authController.updateResetPassWordInDb);

module.exports = router;