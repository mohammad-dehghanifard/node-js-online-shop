const Product = require("../models/product");

// نمایش محصولات داخل صفحه اصلی
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
                    path : "/alldetail",
                    pageTitle : "مشاهده محصول",
                    product : product,
                }
                )
        }
    )
}

// نمایش تمام محصولات داخل صفحه مربوط به محصولات
exports.getAllProductList = (req,res) => {
    Product.find().then(
        products => {
            res.render(
                "shop/allproducts",
                {
                    path : "/allproducts",
                    pageTitle : "مشاهده همه محصولات",
                    productList : products
                }
                )
        }
    )
}

// اضافه کردن ایتم یا اپدیت کردن سبد خرید
exports.addOrUpadateCart = (req,res) =>{
    const id = req.body.ProductId;

    Product.findById(id).then(product => {
        req.user.addToCart(product);

        res.redirect("/");
    })
}