const cookieParser = require("../utils/cookie_parser")
const User = require("../models/user")

exports.renderLoginPage = (req,res) => {
    const isLogged = cookieParser(req);
    res.render("auth/login",{
        path: "/login",
        pageTitle : "ورود به حساب کاربری",
        isAuthenticated : false,
    })
    
}

exports.postLogin = (req,res) => {
    // ذخیره وضعیت لاگین کاربر در کوکی ها
    User.findById("64ec2f18b0d3e21f425a6b34").then(
        user => {
            req.session.loggedIn = true;
            req.session.user = user;
            req.session.save((err) => {res.redirect("/"); })
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
                const user = new User(
                    {
                        name : username,
                        passWord : passWord,
                        email : email,
                        cart: {
                            items: []
                        }
                    }
                );
                return user.save()
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