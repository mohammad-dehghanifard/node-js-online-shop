const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name : {
            type : String,
            required:  true,
            unique : true,
            minlength : 3,
            maxlength : 40,
        },
        email : {
            type : String,
            required:  true,
            unique : true,
            minlength : 8,
            maxlength : 35,
        },
        cart : {
            items : [
                {
                    productId : {
                        type : Schema.Types.ObjectId,
                        ref : "Product",
                        required : true,
                    },
                    quantity : {
                        type : Number,
                        required : true
                    }
                }
            ]
        },
    }
)

// add or update product in cart
userSchema.methods.addToCart = function (product) {
    // در صورتی که محصول داخل سبد خرید کاربر وجود داشته باشه، محصول رو استخراج و داخل متغیر نگهداری میکنه
    const productIndex = this.cart.items.findIndex(
        cartProducts => {
            return cartProducts.productId.toString() == product._id.toString();
        }
    );

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items]; // یه کپی از محصولات داخل سبد خرید میگیره

    // در صورتی که محصول وجود داشته باشه فقط تعدادش رو بالا میبریم
    if(productIndex >= 0)
    {
        newQuantity = this.cart.items[productIndex].quantity + 1;
        updatedCartItems[productIndex].quantity = newQuantity;
    }
    // اضافه کردن محصول جدید به سبد خرید
    else
    {
        updatedCartItems.push(
            {
                productId : product._id,
                quantity : newQuantity,
            }
        )
    }
    // اپدیت کردن سبد خرید
    const updatedCart = {
        items : updatedCartItems,
    }
    this.cart = updatedCart;
    return this.save();
}

// romeve product in cart
userSchema.methods.reomveAtTheCart = function(productId){
    const updatedCartItems = this.cart.items.filter(
        item => {
            return item.productId.toString() !== productId.toString();
        }
    );
    this.cart.items = updatedCartItems;
    return this.save();
}

module.exports = mongoose.model("User",userSchema)