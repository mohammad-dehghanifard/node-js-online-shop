const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const authRouter = require("./routes/auth")
const User = require("./models/user");
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);


const port = 3030;
const app = express();
const mongoUri = "mongodb://0.0.0.0:27017/shop";

app.set("views,views");
app.set("view engine","ejs")
var store = new MongoDBStore(
    {
        uri: mongoUri,
        collection: "session"
    }
);

// static مشخص کردن مسیر فایل های 
app.use(express.static(path.join(__dirname,"public")))
// داده های ارسالی ریسپانس ها رو به جیسون تبدیل میکنه
app.use(bodyParser.urlencoded({extended: false}))

//session config
app.use(session({
    secret : "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
}))

// نوشته بشه admin قبل از ریکوئست های پنل ادمین حتما باید 
app.use("/admin",adminRouter);
app.use(shopRouter);
app.use(authRouter);


mongoose.connect(mongoUri)
.then(result => {
    app.listen(port,()=>{
        
        // در صورتی که یوزی وجود نداشته باشه یه یوزر درست میکنه
        User.findOne().then(
            user => {
                if(!user){
                    const shopUser = new User(
                        {
                            name : "mohammad dehghanifard",
                            email: "mohammad@gmail.com",
                            cart : {
                                items : []
                            }
                        }
                    );
                    shopUser.save();
                }
            }
        )


        console.log("connecte to database and listen on port :",port)
    })
})
.catch(err => {console.error(err.message)});