const Listing = require("./modules/listing");
const Review = require("./modules/review");

module.exports.isLoggedIn = (req, res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error",'You must be signed in to create or edit a listing');
        return res.redirect('/signin');
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=> {
    if(req.session.redirectUrl){
        if (req.session.redirectUrl.includes("/reviews")) {
            res.locals.redirectUrl = req.session.redirectUrl.split("/reviews")[0]; // Strip /reviews part
        } else {
            res.locals.redirectUrl = req.session.redirectUrl;
        }    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);   
    if (!req.user || !listing.owner._id.equals(req.user._id)){
        req.flash("danger",'You dont have the authorization to make changes for this post.')
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(req.user._id)){
        req.flash("danger",'You dont have the authorization to make changes for this post.')
        return res.redirect(`/listings/${id}`);
    }
    next();
}