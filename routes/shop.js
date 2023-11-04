const express = require("express");
const shopController = require('../controllers/shop_controller');
const router = express.Router();
const isAuth = require('../middleware/is-auth')

router.get("/",shopController.getAllProduct)

router.get("/product/:productId",shopController.getProductById);

router.get("/allproducts",shopController.getAllProductList);

router.post("/updateCart",shopController.addOrUpadateCart);

router.post("/cart-remove-item",shopController.removeProductInCart);

router.get("/cart",shopController.getallCartProducts);

router.post("/add-order",shopController.postOrder);

router.get("/orders",shopController.getAllOrders);

router.get("/invoices/:orderId",isAuth,shopController.getInvoice);

router.get("/checkOut",shopController.getChackOut);

module.exports = router