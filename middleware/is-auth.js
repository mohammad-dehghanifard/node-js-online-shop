module.exports = (req,res,next) => {
    if(!req.seesion.loggedIn){
        return res.redirect("/login")
    }
    next();
}