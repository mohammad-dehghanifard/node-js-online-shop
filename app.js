const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mingoos = require('mongoose');
const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const { default: mongoose } = require("mongoose");

const port = 3030;
const app = express();

app.set("views,views");
app.set("view engine","ejs")

// static مشخص کردن مسیر فایل های 
app.use(express.static(path.join(__dirname,"public")))
// داده های ارسالی ریسپانس ها رو به جیسون تبدیل میکنه
app.use(bodyParser.urlencoded({extended: false}))
// نوشته بشه admin قبل از ریکوئست های پنل ادمین حتما باید 
app.use("/admin",adminRouter);
app.use(shopRouter)


mongoose.connect("mongodb://localhost:27017/Shop")
.then(result => {
    app.listen(port,()=>{
        console.log("connecte to database and listen on port :",port)
    })
})
.catch(err => {console.error(err)});