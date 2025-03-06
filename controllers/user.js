const User = require('../modules/user.js');
const passport = require('passport');


module.exports.signupForm = (req,res)=>{
    res.render('../views/users/signup.ejs');
} 

module.exports.signup = async(req,res)=>{
    try{
        let {username, email, password } = req.body;
        const newUser = new User({username, email});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err)=>{
            if(err){
                return next(err)            
            }
            req.flash("success", "successfully signed up.");
            res.redirect('/listings')
        })
       
    }
    catch(e){
        req.flash("error" , e.message);
        res.redirect('/signup');
    }
}

module.exports.signinForm =  (req,res)=>{
    res.render('../views/users/signin.ejs');
}

// module.exports.signin = passport.authenticate('local' , {
//     failureRedirect: '/login',
//      failureFlash: true
//     },),
//     (req,res)=>{
//         req.flash("success", "Welcome to Wanderlust!");
//         console.log(res.locals.redirectUrl)
//         res.redirect(res.locals.redirectUrl);
//     }

module.exports.signin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.redirect('/login');

        req.logIn(user, (err) => {
            if (err) return next(err);

            req.flash("success", "Welcome to Wanderlust!");
            res.redirect(res.locals.redirectUrl || "/listings"); // Fallback in case redirectUrl is undefined
        });
    })(req, res, next);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
    req.flash('success','Logged out successfully.');
    res.redirect('/listings');
    });
}
