const cookieParser = require("../utils/cookie_parser")
const User = require("../models/user")
const bcrypt = require('bcryptjs');

exports.renderLoginPage = (req,res) => {
    const isLogged = cookieParser(req);
    res.render("auth/login",{
        path: "/login",
        pageTitle : "ورود به حساب کاربری",
        isAuthenticated : false,
    })
    
}

exports.postLogin = (req,res) => {
    const email = req.body.email;
    const pass = req.body.passWord;
    // ذخیره وضعیت لاگین کاربر در کوکی ها
    User.findOne({email:email}).then(
        user => {

           if(!user){
            res.redirect("/login");
           }

           // conpare user password and login
           bcrypt.compare(pass,user.passWord).then(isMatch => {
            if(isMatch){
                req.session.loggedIn = true;
                req.session.user = user;
                req.session.save((err) => {res.redirect("/"); })
            }else{
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
        res.redirect("/login");
    }).catch(
        error => {
            console.error(error);
        }
    )
}