const express = require('express');
const router = express.Router({mergeParams: true});

const Listing = require('../modules/listing');
const Review = require('../modules/review');
const {reviewSchema} = require('../schema.js');

const wrapAsync = require('../utils/wrapAsync.js');
//reviews
//posting reviews
const validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if (error){
        throw new ExpressError(400,error);
    }
    next()
}

router.post('/', validateReview, wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let review = new Review(req.body.review);
    await review.save();
    listing.reviews.push(review);
    await listing.save();
    res.redirect('/listings/'+req.params.id);
}))

//delete reviews
router.delete('/:reviewId', wrapAsync(async(req,res)=>{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}))

module.exports =  router;
