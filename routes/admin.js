const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin_controller")

router.get("/add-product",adminController.getAddProducte);
router.post("/add-product",adminController.addPostProduct);
router.get("/products",adminController.getAllProducts);
router.get("/edit-product/:productId",adminController.getEditProduct)

module.exports = router