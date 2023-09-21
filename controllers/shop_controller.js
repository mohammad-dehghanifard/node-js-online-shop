const Product = require("../models/product");
const Order = require("../models/order")

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

// دریافت تمام محصولات داخل سبد خرید کاربر
exports.getallCartProducts = async (req,res) => {
    // populate => به ایتم های زیر مجموعه دسترسی پیدا میکنیم
    const data = await req.user.populate('cart.items.productId');

    res.render(
        "shop/cart",
        {
            path : "/cart",
            pageTitle : "سبد خرید",
            productList : data.cart.items
        }
    )
}

// حذف محصول از سبد خرید
exports.removeProductInCart = (req,res) => {
    const proId = req.body.productId;
    req.user.reomveAtTheCart(proId);
    res.redirect("/cart");
}

//ارسال سفارشات کاربر به دیتابیس 
exports.postOrder = (req,res) => {
    req.user.populate("cart.items.productId").then(
        user => {
            const productList = user.cart.items.map(i => {
                return {quantity: i.quantity,product: {...i.productId._doc}}
            });

            const order = new Order( {
                    user : {
                        name : req.user.name,
                        userId : req.user
                    },
                    products : productList
                },
            );
            return order.save();
        }
    ).then( () =>{ return req.user.removeAllItemsInCart();})
    .then(()=> {res.redirect("/orders")})
}

exports.getAllOrders = (req,res) => {
 Order.find({'user.userId': req.user._id}).then(
    orders => {
        res.render(
            "shop/orders",
            {
                path : "/allorders",
                pageTitle : "سفارشات شما",
                orders : orders
            }
            )
    }
 )
}