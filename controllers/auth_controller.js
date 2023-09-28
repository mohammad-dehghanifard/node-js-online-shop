const cookieParser = require("../utils/cookie_parser")

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
    req.session.loggedIn = true;
    res.redirect("/");
}

exports.postLogOut = (req,res) => {
    req.session.destroy((err) => {
        res.redirect("/");
    });
}