const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const userModel = require("./models/user")

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


mongoose.connect("mongodb://0.0.0.0:27017/shop")
.then(result => {
    app.listen(port,()=>{
        
        // در صورتی که یوزی وجود نداشته باشه یه یوزر درست میکنه
        
        userModel.findOne().then(
            user => {
                const shopUser = new userModel(
                    {
                        name : "mohammad dehghanifard",
                        email: "mohammad@gmail.com",
                        cart : {
                            items : []
                        }
                    }
                )
            }
        )


        console.log("connecte to database and listen on port :",port)
    })
})
.catch(err => {console.error(err.message)});