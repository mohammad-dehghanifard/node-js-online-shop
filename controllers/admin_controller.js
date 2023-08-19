const Product = require("../models/product")


function getAddProducte(req,res){
    res.render("admin/add-product",{
        path : "admin/add-product",
        pageTitle : "افزودن محصول جدید",
        editing : false,
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

function getEditProduct(req,res){
 const editMode = req.query.edit;

 if(!editMode){
    res.redirect("/");
 }

 const productId = req.params.productId;

 Product.findById(productId).then(
    product => {

        if(!product){
            res.redirect("/");
        }

        res.render(
            'admin/add-product',
            {
                path : "admin/edit-product",
                pageTitle : "ویرایش مخصول جدید",
                editing : editMode,
                product : product
            }
            )
    }
 )
 
}

function postEditProduct(req,res) {
    const productId = req.body.productID;

    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageurl;
    const updatedContent = req.body.content;

    Product.findById(productId).then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.imageurl = updatedImageUrl;
        product.content = updatedContent;
        return product.save();
    })
    .then(result => {
        res.redirect("/");
    });
}

function deleteProduct(req,res){
    const productID = req.body.productId;

    Product.findByIdAndRemove(productID)
    .then(()=>{
        console.log("Product Deleted....");
        res.redirect("/admin/products")
    })
    .catch(error => {console.error(error.message)})
}

module.exports = {
    getAddProducte,
    addPostProduct,
    getAllProducts,
    getEditProduct,
    postEditProduct,
    deleteProduct,
};