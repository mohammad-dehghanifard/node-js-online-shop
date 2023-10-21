const cookieParser = require("../utils/cookie_parser")
const User = require("../models/user")
const bcrypt = require('bcryptjs');
const emailService = require("../utils/email_sender")

exports.renderLoginPage = (req,res) => {
    // اگر دیتا وجود نداشته باشه ارایه خالی برمیگردونه
    let errorMessage = req.flash('LoginError');
    
    if(errorMessage.length > 0){
        errorMessage = errorMessage[0];
    }else{
        errorMessage = errorMessage;
    }
    console.log(req.flash('LoginError'));
    res.render("auth/login",{
        path: "/login",
        pageTitle : "ورود به حساب کاربری",
        message : errorMessage
    })
    
}

exports.postLogin = (req,res) => {
    const email = req.body.email;
    const pass = req.body.passWord;
    // ذخیره وضعیت لاگین کاربر در کوکی ها
    User.findOne({email:email}).then(
        user => {

           if(!user){
            req.flash('LoginError','نام کاربری یا رمز عبور وارد شده اشتباه میباشد');
            res.redirect("/login");
           }

           // conpare user password and login
           bcrypt.compare(pass,user.passWord).then(isMatch => {
            if(isMatch){
                req.session.loggedIn = true;
                req.session.user = user;
                req.session.save((err) => {res.redirect("/"); })
            }else{
                req.flash('LoginError','نام کاربری یا رمز عبور وارد شده اشتباه میباشد');
                res.redirect("/login");
            }
           })
        }
    );
    
   
}

exports.postLogOut = (req,res) => {
    req.session.destroy((err) => {
        res.redirect("/");
    });
}

exports.getSignPage = (req,res) => {
    res.render("auth/signup",(
        {
            path: "/signup",
            pageTitle: "ثبت نام",
            isAuthenticated : false
        }
    ))
}

exports.postSignUp = (req,res) => {
    const username = req.body.name;
    const email = req.body.email;
    const passWord = req.body.passWord;
    const confirmPassWord = req.body.confirmPassWord;
    // در صورتی که یوزری با این ایمل قبلا وجود نداشته باشه، یوزر جدید ساخته میشه
    User.findOne({email:email}).then(
        userDoc => {
            if(userDoc){
                res.redirect("/login")
            }else{
                return bcrypt.hash(passWord,16).then(hashPassword => {
                    const user = new User(
                        {
                            name : username,
                            passWord : hashPassword,
                            email : email,
                            cart: {
                                items: []
                            }
                        }
                    );
                    return user.save()
                })
            }
        }
    ).then(() =>{
        emailService(
            {
                to: email, 
                subject: "خوش آمدید", 
                text: "ثبت نام شما با موفقیت انجام شد به فروشگاه ما خوش آمدید",
            }
        )
        res.redirect("/login");
    }).catch(
        error => {
            console.error(error);
        }
    )
}