const product = require("../models/product")


function getAddProducte(req,res){
    res.render("admin/add-product")
}

module.exports = {getAddProducte};