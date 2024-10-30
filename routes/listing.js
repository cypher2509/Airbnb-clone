const express = require("express");
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js')
const {listingSchema} = require('../schema.js');
const Listing = require('../modules/listing');
//validations
const validateListing = (req,res, next)=>{
    console.log(req.body);
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }
    next();
}

//listings
//getting listings
router.get('/',wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render('listings/index.ejs',{allListings});
}));
//posting listings
router.post('/', validateListing, wrapAsync(async(req,res,next)=>{
        let listing = req.body;
        const newListing = new Listing(listing);
        await newListing.save()
        req.flash("success", "New Listing created!");
        res.redirect('/listings');
}));

//getting form listing page
router.get('/new',wrapAsync(async(req,res)=>{
    res.render('listings/new.ejs',);
}));

//showing the listing
router.get('/:id', wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render('listings/show.ejs',{listing});
}));

//getting form to edit listing 
router.get('/:id/edit', wrapAsync(async(req,res,next)=>{
        let {id} = req.params;
        const listing = await Listing.findById(id);
        
        res.render('listings/edit.ejs',{listing});

}));

//modifying the listing
router.put('/:id', wrapAsync(async(req,res)=>{
        let {id} = req.params;
        let listing = {...req.body.listing};
        await Listing.findByIdAndUpdate(id, listing);
        req.flash("success","Listing successfully edited.") 
        res.redirect(`/listings/${id}`);
}));

//deleting the listing
router.delete('/:id',wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing successfully Deleted.") 
    res.redirect('/listings'); 
}));

module.exports = router;