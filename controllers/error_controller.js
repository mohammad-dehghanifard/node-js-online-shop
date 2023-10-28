exports.get500 = (req,res) => {
    res.status(500).render(
        "errors/500",{
            path : "/error500",
            pageTitle: "خطای 500"
        }
        
    )
}