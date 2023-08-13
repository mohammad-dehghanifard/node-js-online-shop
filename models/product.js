const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema(
{
    title : {type : String,required : true},
    content : {type : String,required : true},
    imageurl : {type : String,required : true},
    price : {type : Number,required : true},
}
);

const product = mongoose.model("Product",productSchema);

module.exports = product;