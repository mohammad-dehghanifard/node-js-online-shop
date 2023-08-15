const Product = require("../models/product");

exports.getAllProduct = (req,res) => {
    const data = Product.find().then(products => {
        res.render("shop/index",{
            path : "/",
            pageTitle : "صفحه اصلی",
            productList : products,
        })
    })
}

exports.getProductById = (req,res) => {
    const productId = req.params.productId;
    Product.findById(productId).then(
        product => {
            res.render(
                "shop/product_details",
                {
                    path : "/allproduct",
                    pageTitle : "مشاهده محصول",
                    product : product,
                }
                )
        }
    )
}