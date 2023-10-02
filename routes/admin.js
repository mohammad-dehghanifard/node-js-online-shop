const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin_controller");
const isAuth = require("../middleware/is-auth");

router.get("/add-product",isAuth,adminController.getAddProducte);
router.post("/add-product",adminController.addPostProduct);
router.get("/products",isAuth,adminController.getAllProducts);
router.get("/edit-product/:productId",adminController.getEditProduct)
router.post("/edit-product",adminController.postEditProduct)
router.post("/delete-product",adminController.deleteProduct)

module.exports = router