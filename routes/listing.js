const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');

const listingsController = require("../controllers/listings.js")
const {listingSchema} = require('../schema.js');
const {isLoggedIn, isOwner} = require('../middleware.js');
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
router.get('/',wrapAsync(listingsController.index));
//posting listings
router.post('/',isLoggedIn ,validateListing, wrapAsync(listingsController.newListings));

//getting form listing page
router.get('/new',isLoggedIn ,wrapAsync(listingsController.newListingsForm));

//showing the listing
router.get('/:id', wrapAsync(listingsController.getListing));

//getting form to edit listing 
router.get('/:id/edit',isLoggedIn, isOwner, wrapAsync(listingsController.editListingForm));

//modifying the listing
router.put('/:id',isLoggedIn, isOwner, wrapAsync(listingsController.editListing));

//deleting the listing
router.delete('/:id',isLoggedIn,wrapAsync(listingsController.deleteListing));

module.exports = router;