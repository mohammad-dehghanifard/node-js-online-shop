exports.renderLoginPage = (req,res) => {
    res.render("auth/login",{
        path: "/login",
        pageTitle : "ورود به حساب کاربری",
        isAuthenticated : false,
    })
}

exports.postLogin = (req,res) => {
    // ذخیره وضعیت لاگین کاربر در کوکی ها
    res.setHeader('Set-Cookie',"loggedIn=true");
    res.redirect("/");
}