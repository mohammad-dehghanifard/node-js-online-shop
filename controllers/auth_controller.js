exports.renderLoginPage = (req,res) => {
    res.render("auth/login",{
        path: "/login",
        pageTitle : "ورود به حساب کاربری"
    })
}