const Product = require("../models/product")


function getAddProducte(req,res){
    res.render("admin/add-product",{
        path : "admin/add-product",
        pageTitle : "افزودن محصول جدید"
    })
}

function addPostProduct(req,res){

    const title = req.body.title;
    const content = req.body.content;
    const price = req.body.price;
    const imageUrl = req.body.imageurl;

    const product = new Product({
        title : title,
        content : content,
        price : price,
        imageurl : imageUrl,
    })

    product.save().then(result => {
        console.log("product added....");
        res.redirect('/')
    })

}

function getAllProducts(req,res){
    Product.find().
    then(products => {
        res.render("admin/products",{
            path : "/products",
            pageTitle : "محصولات ادمین",
            productList : products,
        })
    }).catch(
        error => {console.log(error)}
    )
}

module.exports = {getAddProducte,addPostProduct,getAllProducts};