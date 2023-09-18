const express = require("express");
const shopController = require('../controllers/shop_controller');
const router = express.Router();

router.get("/",shopController.getAllProduct)

router.get("/product/:productId",shopController.getProductById);

router.get("/allproducts",shopController.getAllProductList);

router.post("/updateCart",shopController.addOrUpadateCart);

router.post("/cart-remove-item",shopController.removeProductInCart);

router.get("/cart",shopController.getallCartProducts);

module.exports = router