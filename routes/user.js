const express = require("express");
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js')

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../modules/user.js');
const { saveRedirectUrl } = require("../middleware.js");

router.get('/signup', (req,res)=>{
    res.render('../views/users/signup.ejs');
} )

router.post('/signup', wrapAsync(async(req,res)=>{
    try{
        let {username, email, password } = req.body;
        const newUser = new User({username, email});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
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
}));

router.get('/signin', (req,res)=>{
    res.render('../views/users/signin.ejs');
})

router.post('/signin', saveRedirectUrl, passport.authenticate('local' , {
    failureRedirect: '/login',
     failureFlash: true
    },),
    (req,res)=>{
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect(res.locals.redirectUrl);
    }
);

router.get('/logout',(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
    req.flash('success','Logged out successfully.');
    res.redirect('/listings');
    });
});


module.exports = router;