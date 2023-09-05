const express = require("express");
const shopController = require('../controllers/shop_controller');
const router = express.Router();

router.get("/",shopController.getAllProduct)

router.get("/product/:productId",shopController.getProductById);

router.get("/allproducts",shopController.getAllProductList)

router.post("/cart",shopController.addOrUpadateCart)

module.exports = router