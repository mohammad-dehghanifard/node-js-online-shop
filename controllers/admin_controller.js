const Product = require("../models/product")


function getAddProducte(req,res){
    res.render("admin/add-product")
}

function addPostProduct(req,res){

    const title = req.body.title;
    const content = req.body.content;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;

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

module.exports = {getAddProducte,addPostProduct};