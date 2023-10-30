const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema(
{
    title : {type : String,required : true},
    content : {type : String,required : true},
    imageurl : {type : String,required : false},
    price : {type : Number,required : true},
    userId : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required :true,
    }
}
);

const product = mongoose.model("Product",productSchema);

module.exports = product;