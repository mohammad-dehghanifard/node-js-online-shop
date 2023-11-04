const Product = require('../models/product');
const Order = require('../models/order');
const cookieParser = require('../utils/cookie_parser');
const path = require('path');
const fs = require('fs');
const pdfkit = require('pdfkit');
const zarinPalCheckOut = require("zarinpal-checkout");
const { isErrored } = require('stream');

const pageSize = 2;
const zarinpal = zarinPalCheckOut.create('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',true)
// نمایش محصولات داخل صفحه اصلی
exports.getAllProduct = (req, res) => {
  const page = req.query.page === undefined? 1 : parseInt(req.query.page) //=> در صورتی که از ریکوئست مقداری رو نگیره 1 رو داخل خودش میریزه
  let totalProduct;
  // صفحه بندی
   Product.find()
   .count()
   .then((numProduct)=>{
      totalProduct = numProduct;
      return Product.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
   }).then(products => {
    // رندر کردن صفحه اصلی
      res.render('shop/index', {
        path: '/',
        pageTitle: 'صفحه اصلی',
        productList: products,
        productCount : totalProduct,
        hasnextPage : pageSize * page < totalProduct,
        hasPreviousPage: page > 1,
        nextPage : page+1,
        previousPage: page-1,
        currentPage: page,
        lastPage: Math.ceil( totalProduct / pageSize), // ceil => خروجی رو رند میکنه تا اگر اعشار برگردوند برنامه به خطا نخوره
      })
    })
}

exports.getProductById = (req, res) => {
  const isLogged = cookieParser(req)
  const productId = req.params.productId
  Product.findById(productId).then(product => {
    res.render('shop/product_details', {
      path: '/alldetail',
      pageTitle: 'مشاهده محصول',
      product: product
    })
  })
}

// نمایش تمام محصولات داخل صفحه مربوط به محصولات
exports.getAllProductList = (req, res) => {
  const isLogged = cookieParser(req)
  Product.find().then(products => {
    res.render('shop/allproducts', {
      path: '/allproducts',
      pageTitle: 'مشاهده همه محصولات',
      productList: products
    })
  })
}

// اضافه کردن ایتم یا اپدیت کردن سبد خرید
exports.addOrUpadateCart = (req, res) => {
  const id = req.body.ProductId

  Product.findById(id).then(product => {
    req.user.addToCart(product)

    res.redirect('/')
  })
}

// دریافت تمام محصولات داخل سبد خرید کاربر
exports.getallCartProducts = async (req, res) => {
  // populate => به ایتم های زیر مجموعه دسترسی پیدا میکنیم
  const user = await req.user.populate('cart.items.productId')
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'سبد خرید',
    productList: user.cart.items
  })
}

// حذف محصول از سبد خرید
exports.removeProductInCart = (req, res) => {
  const proId = req.body.productId
  req.user.reomveAtTheCart(proId)
  res.redirect('/cart')
}

//ارسال سفارشات کاربر به دیتابیس
exports.postOrder = (req, res) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const productList = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } }
      })

      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: productList
      })
      return order.save()
    })
    .then(() => {
      return req.user.removeAllItemsInCart()
    })
    .then(() => {
      res.redirect('/orders')
    })
}
// دریافت لیست سفارشات کاربر
exports.getAllOrders = (req, res) => {
  Order.find({ 'user.userId': req.user._id }).then(orders => {
    res.render('shop/orders', {
      path: '/allorders',
      pageTitle: 'سفارشات شما',
      orders: orders
    })
  })
}

//دریافت گزارش سفارشات توسط کاربر
exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId
  const invoiceName = 'invoice-' + orderId + '.pdf'
  const invoicePath = path.join('files', 'invoices', invoiceName)

  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('Order Not Found...'))
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('This report is not related to your orders!'))
      }
      // ایجاد فایل پی دی اف و دانلود توسط کاربر
      else {
        const pdfDoc = new pdfkit()
        res.setHeader('Content-Type', 'application/pdf')
        res.setHeader(
          'Content-Disposition',
          'inline; filename="' + invoiceName + '"'
        )
        pdfDoc.pipe(fs.createWriteStream(invoicePath))
        pdfDoc.pipe(res)
        //پر کردن اطلاعات پی دی اف
        pdfDoc.fontSize(24).text('Invoice')
        pdfDoc
          .fontSize(12)
          .text('................................................')
        let totalPrice = 0
        order.products.forEach(it => {
          totalPrice += it.quantity * it.product.price
          pdfDoc.text(it.product.title + it.quantity)
          pdfDoc.text('Price : ' + it.product.price.toString())
        })
        pdfDoc.text('Total Price: ' + totalPrice.toString())
        pdfDoc.end()
      }
    })
    .catch(err => next(err))
}

exports.getChackOut = async (req,res) => {
  const user = await req.user.populate('cart.items.productId')
  const allproducts = user.cart.items;
  let totalPrice = 0;
  allproducts.forEach(product => {
    totalPrice += product.quantity * product.productId.price;
  })

  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'پرداخت نهایی',
    productList: user.cart.items,
    totalSum: totalPrice,
  })
}

exports.getPayment = async (req,res,next)=> {
  const user = await req.user.populate('cart.items.productId')
  const allproducts = user.cart.items;
  let totalPrice = 0;
  allproducts.forEach(product => {
    totalPrice += product.quantity * product.productId.price;
  });

  zarinpal.PaymentRequest({
    Amount : totalPrice,
    CallbackURL : "http://localhost:3030/CheckPayment",
    Email : user.email,
    Description : "تست درگاه پرداخت"
  }).then(result => {
   return res.redirect(result.url);
  }).catch(err => {
    next(err);
  })
}

exports.CheckPayment = async (req,res,next) =>{
  const status = req.query.Status;
  const authority = req.query.Authority;

  const user = await req.user.populate('cart.items.productId')
  const allproducts = user.cart.items;
  let totalPrice = 0;
  allproducts.forEach(product => {
    totalPrice += product.quantity * product.productId.price;
  });

  if(status === "OK"){
    zarinpal.PaymentVerification({
      Amount: totalPrice, // In Tomans
      Authority: authority,
    }).then( result =>{
      this.postOrder(req,res)
    }
    )
  }else if(status === "NOK"){
    res.redirect("/cart")
  }

}