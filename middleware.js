const Listing = require("./modules/listing");

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
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = (req,res,next)=>{
    let {id} = req.params;
    let listing = Listing.findById(id);
    if(!listing.owner.equals(req.locals.currUser._id)){
        req.flash("danger",'You dont have the authorization to make changes for this post.')
        return res.redirect(`/listings/${id}`);
    }
    next();
}