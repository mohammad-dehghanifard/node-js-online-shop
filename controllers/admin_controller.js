const Product = require("../models/product")
const cookieParser = require("../utils/cookie_parser")
const {validationResult} = require("express-validator");
const fileHelper = require('../utils/file_clear');


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

function addPostProduct(req,res,next){

    const title = req.body.title;
    const content = req.body.content;
    const price = req.body.price;
    const image = req.file // => (multer)دریافت فایل انتخاب شده توسط کاربر با کمک پکیج ;
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
                imageUrl: image.path,
            }
        });
    }

    // در صورتی که کاربر به جای عکس فایل دیگه ای انتخاب کنه
    if(!image){
        return res.status(422).render("admin/add-product",{
            path : "admin/add-product",
            pageTitle : "افزودن محصول جدید",
            editing : false,
            errorMessage : "لطفا برای تصویر محصول خود یک تصویر معتبر انتخاب کنید",
            oldUserInput: {
                title: title,
                content: content,
                price: price,
            }
        })
    }

    const product = new Product({
        title : title,
        content : content,
        price : price,
        imageurl : image.path,
        userId : req.user
    })

    product.save().then(result => {
        res.redirect('/')
    }).catch(err =>{
         const error = new Error(err);
         error.httpStatusCode = 500;
         return next(error);
    })

}

//دریافت تمام محصولات فروشنده
function getAllProducts(req,res,next){
    Product.find({userId: req.user._id}).
    then(products => {
        res.render("admin/products",{
            path : "/products",
            pageTitle : "محصولات ادمین",
            productList : products,
        })
    }).catch(
        err => {
         const error = new Error(err);
         err.httpStatusCode = 500;
         return next(error);
        }
    )
}

function getEditProduct(req,res,next){
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
 ).catch(err =>{
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
 });
 
}

function postEditProduct(req,res,next) {
    const productId = req.body.productID;

    // در صورتی که کاربر دیگه ای به جز صاحب محصول باشه ویرایش انجام نمیشه و به صفحه اصلی منتقل میشه
    if(productId.toString() !== req.user._id.toString()){
        return res.redirect("/");
    }

    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImage = req.file;
    const updatedContent = req.body.content;

    Product.findById(productId).then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        // در صورتی که کاربر عکس جدیدی انتخاب کرده باشه عکس عوض میشه
        if(updatedImage){
            fileHelper.fileClear(product.imageurl);
            product.imageurl = updatedImage;
        }
        product.content = updatedContent;
        return product.save().then(result => {
            res.redirect("/");
        });
    }).catch(err => { 
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);});
    
}

function deleteProduct(req,res,next){
    const productID = req.params.productId;

    Product.findById(productID).then(
        (product) => {
            if(!product){
                return next(new Error("Product Not Found...."))
            }
            fileHelper.fileClear(product.imageurl);
            return Product.findOneAndDelete({
                _id : productID,
                userId : req.user._id // برای جلوگیری از حذف محصول توسط فروشنده های دیگه
            })
        }
    ).then(product =>{
        if(product){
         res.json({
            message: "product deleted...."
         });
        }else{
            res.json({
                message: "product deleted faield...."
             });
        }
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}

module.exports = {
    getAddProducte,
    addPostProduct,
    getAllProducts,
    getEditProduct,
    postEditProduct,
    deleteProduct,
};