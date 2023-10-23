const cookieParser = require("../utils/cookie_parser");
const User = require("../models/user");
const bcrypt = require('bcryptjs');
const sendEmail = require("../utils/email_sender");
const crypto = require('crypto');
const user = require("../models/user");

exports.renderLoginPage = (req,res) => {
    // اگر دیتا وجود نداشته باشه ارایه خالی برمیگردونه
    let errorMessage = req.flash('LoginError');
    errorMessage = errorMessage.length > 0? errorMessage[0] : null;
    res.render("auth/login",{
        path: "/login",
        pageTitle : "ورود به حساب کاربری",
        message : errorMessage
    })
    
}

// برسی یوزر و پسور کاربر و اجرای عملیات ورود
exports.postLogin = async (req, res) => {
    const email = req.body.email;
    const pass = req.body.passWord;

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            req.flash('LoginError', 'نام کاربری یا رمز عبور وارد شده اشتباه می‌باشد');
            return res.redirect("/login");
        }

        const isMatch = await bcrypt.compare(pass, user.passWord);

        if (isMatch) {
            req.session.loggedIn = true;
            req.session.user = user;
            req.session.save((err) => {
                if (err) {
                    console.error('خطا در ذخیره‌سازی session:', err);
                }
                res.redirect("/");
            });
        } else {
            req.flash('LoginError', 'نام کاربری یا رمز عبور وارد شده اشتباه می‌باشد');
            res.redirect("/login");
        }
    } catch (error) {
        console.error('خطا در فرآیند ورود:', error);
        res.status(500).send('خطا در ورود به سیستم');
    }
};

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
// رندر کردن صفحه بازیابی رمزعبور
exports.renderResetPassView = (req,res) => {
    res.render('auth/reset_Pass',{pageTitle: "بازیابی رمز عبور",})
}

// ارسال توکن برای بازیابی رمز عبور به ایمیل کاربر
exports.sendTokenForResetPassWord = (req,res) => {
    // ایجاد توکن
    crypto.randomBytes(
        32,
        (err,buf) =>{
            if(err){
                console.log(err);
                res.redirect("/restPass")
            }

            const token = buf.toString('hex');
            User.findOne({email: req.body.email}).then(user => {

                if(!user){
                    return res.redirect("/login");
                }
                //save token and expire date token in database
                user.resetToken = token;
                user.expireResetTokenDate = Date.now() + 3600000;
                return user.save();

            }).then(result => {
                res.redirect('/login');
                // بخش ارسال ایمل باگ داره
                // sendEmail({
                //      userMail : req.body.email, 
                //      subject : "بازیابی رمز عبور", 
                //      html : `<p>جهت بازیابی رمز عبور خود روی لینک زیر کلیک کنید</p>
                //      <a href="http://localhost:3030/resetPass/${token}">بازیابی رمزعبور</a>
                //      `,
                // })
            })
        }
    );
}

exports.renderSetNewPassWordView = (req,res) => {
    const token = req.params.token;
    User.findOne({resetToken:token}).then(user => {
        res.render(
            'auth/set_new_pass',
            {
                pageTitle: "تعویض رمز عبور",
                userId: user._id.toString(),
                passWordToken : token,
            }
            )
    });
}

exports.updateResetPassWordInDb = (req,res) => {
    const newPass = req.body.newPassWord;
    const userId = req.body.userId;
    const passWordToken = req.body.passWordToken;
    let extractedUser;

    User.findOne({
        resetToken: passWordToken,
        expireResetTokenDate : {$gt : Date.now()},
        _id : userId
    }).then(user => {
        extractedUser = user;
        return bcrypt.hash(newPass,12);
    }).then(hashPassword => {
        extractedUser.passWord = hashPassword;
        extractedUser.resetToken = undefined;
        extractedUser.expireResetTokenDate = undefined;
        return extractedUser.save();
    }).then(result => {
        res.redirect("/login");
    }).catch(err => {
        console.error(err);
    });
}

