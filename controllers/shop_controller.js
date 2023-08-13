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