const express = require("express");
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js')

const LocalStrategy = require('passport-local');
const User = require('../modules/user.js');
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router.get('/signup', userController.signupForm)

router.post('/signup', wrapAsync(userController.signup));

router.get('/signin', userController.signinForm)

router.post('/signin', saveRedirectUrl, userController.signin);

router.get('/logout',userController.logout);


module.exports = router;