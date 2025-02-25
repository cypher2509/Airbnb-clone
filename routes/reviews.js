const express = require('express');
const router = express.Router({mergeParams: true});

const Listing = require('../modules/listing');
const Review = require('../modules/review');
const {reviewSchema} = require('../schema.js');

const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isReviewAuthor } = require('../middleware.js');
const reviewController = require('../controllers/review.js');
//reviews
//posting reviews
const validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if (error){
        throw new ExpressError(400,error);
    }
    next()
}

router.post('/', validateReview, isLoggedIn, wrapAsync(reviewController.postReview))

//delete reviews
router.delete('/:reviewId',isReviewAuthor, wrapAsync(reviewController.deleteReview))

module.exports =  router;
