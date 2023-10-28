const Product = require("../models/product")
const cookieParser = require("../utils/cookie_parser")
const {validationResult} = require("express-validator");
const mongoose = require("mongoose");


function getAddProducte(req,res){
    const isLogged = cookieParser(req);
    res.render("admin/add-product",{
        path : "admin/add-product",
        pageTitle : "افزودن محصول جدید",
        editing : false,
        errorMessage: null,
        oldUserInput: {}
    })
}

function addPostProduct(req,res){

    const title = req.body.title;
    const content = req.body.content;
    const price = req.body.price;
    const imageUrl = req.body.imageurl;
    const errors = validationResult(req);

    // در صورتی که اعتبار سنجی به مشکل بخوره
    if(!errors.isEmpty()){
        return res.status(422).render("admin/add-product",{
            path : "admin/add-product",
            pageTitle : "افزودن محصول جدید",
            editing : false,
            errorMessage : errors.array()[0].msg,
            oldUserInput: {
                title: title,
                content: content,
                price: price,
                imageUrl: imageUrl
            }
        })
    }

    const product = new Product({
        _id : new mongoose.Types.ObjectId("64d8ce12a09720aadb4e392e"),
        title : title,
        content : content,
        price : price,
        imageurl : imageUrl,
        userId : req.user
    })

    product.save().then(result => {
        console.log("product added....");
        res.redirect('/')
    }).catch(err =>{
         return res.redirect("/500")
    })

}

//دریافت تمام محصولات فروشنده
function getAllProducts(req,res){
    const isLogged = cookieParser(req);
    Product.find({userId: req.user._id}).
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
 const isLogged = cookieParser(req);

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
                product : product,
                errorMessage: null,
                oldUserInput: {}
            }
            )
    }
 )
 
}

function postEditProduct(req,res) {
    const productId = req.body.productID;

    // در صورتی که کاربر دیگه ای به جز صاحب محصول باشه ویرایش انجام نمیشه و به صفحه اصلی منتقل میشه
    if(productId.toString() !== req.user._id.toString()){
        return res.redirect("/");
    }

    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageurl;
    const updatedContent = req.body.content;

    Product.findById(productId).then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.imageurl = updatedImageUrl;
        product.content = updatedContent;
        return product.save().then(result => {
            res.redirect("/");
        });
    }).catch(err => {console.error(err)});
    
}

function deleteProduct(req,res){
    const productID = req.body.productId;

    Product.findOneAndDelete({
        _id : productID,
        userId : req.user._id // برای جلوگیری از حذف محصول توسط فروشنده های دیگه
    })
    .then(product =>{
        if(product){
         console.log("Product Deleted....");
         res.redirect("/admin/products")
        }else{
            res.redirect("/")
        }
    })
    .catch(error => {
        console.error(error.message)})
}

module.exports = {
    getAddProducte,
    addPostProduct,
    getAllProducts,
    getEditProduct,
    postEditProduct,
    deleteProduct,
};