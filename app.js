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
const csrf = require('csurf');
const flash = require('connect-flash');
const errorController = require("./controllers/error_controller");
const multer = require("multer");


const port = 3030;
const app = express();
const mongoUri = "mongodb://0.0.0.0:27017/shop";
var csrfProtection = csrf();

// مشخص کردن محل ذخیره تصاویر
const fileStorageOption = multer.diskStorage({
    // cb => callBack Function
    destination : (req,file,cb) =>{
        cb(null,"assets/images/product");
    },
    filename: (req,file,cb) => {
        cb(null,Date.now().toString() + "-" + file.originalname);
    }
});

// فیلتر کردن فایل های بر اساس نوع
function fileFilterConfig(req,file,cb) {
    if(
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
        ){
            cb(null,true);
    }else{
        cb(null,false);
    }
}

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
app.use(bodyParser.urlencoded({extended: false}));
//ارسال عکس محصول به سرور
app.use(multer({
    storage : fileStorageOption,
    fileFilter : fileFilterConfig
}).single("productImg"));
// برای پاس دادن داده موقع ری دایرکت کردن کاربر
app.use(flash());
//session config
app.use(session({
    secret : "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
}))

app.use(csrfProtection);
// send locale propertis
app.use((req,res,next) => {
    res.locals.isAuthenticated = req.session.loggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})



app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id).then(user => {
        if(!user){
            return next();
        }
        req.user = user;
        next();
    }).catch(err => {
        console.log(err);
    })
});

// نوشته بشه admin قبل از ریکوئست های پنل ادمین حتما باید 
app.use("/admin",adminRouter);
app.use(shopRouter);
app.use(authRouter);
app.get("/500",errorController.get500);

app.use((error,req,res,next) => {
    res.redirect("/500")
})


mongoose.connect(mongoUri)
.then(result => {
    app.listen(port,()=>{
        console.log("connecte to database and listen on port :",port)
    })
})
.catch(err => {console.error(err.message)});