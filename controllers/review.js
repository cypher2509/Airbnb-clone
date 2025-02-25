const Listing = require('../modules/listing');
const Review = require('../modules/review');

module.exports.postReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let review = new Review(req.body.review);
    review.author = req.user._id; 
    console.log(review)
    await review.save();
    listing.reviews.push(review);
    await listing.save();
    req.flash("success","Review added successfully.") 
    res.redirect('/listings/'+req.params.id);
}
module.exports.deleteReview = async(req,res)=>{
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted successfully.") 
    res.redirect(`/listings/${id}`);
}