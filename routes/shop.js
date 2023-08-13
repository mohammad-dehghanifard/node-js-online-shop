const express = require("express");
const router = express.Router();

router.get("/",(req,res)=>{
    res.render("shop/index",{
        path : "/",
        pageTitle : "صفحه اصلی"
    })
})

module.exports = router