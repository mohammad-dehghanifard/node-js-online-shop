const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin_controller");
const isAuth = require("../middleware/is-auth");
const {body} = require('express-validator');

router.get("/add-product",isAuth,adminController.getAddProducte);
router.post(
    "/add-product",
    [
        body('title',"نام محصول بسیار کوتاه میباشد. لطفا یک نام مناسب وارد کنید").isString().isLength({min: 10,max:50}).trim(),
        body('price',"قیمت وارد شده معتبر نمیباشد").isFloat(),
        body("imageurl","لینک تصویر وارد شده صحیح نمیباشد").isURL(),
        body("content","توضیحات محصول باید بیشتر از 15 و کمتر از 500 کلمه باشد").isString().isLength({min:15,max:500}).trim(),
        
    ],
    adminController.addPostProduct
    );
router.get("/products",isAuth,adminController.getAllProducts);
router.get("/edit-product/:productId",adminController.getEditProduct)
router.post("/edit-product",adminController.postEditProduct)
router.post("/delete-product",adminController.deleteProduct)

module.exports = router