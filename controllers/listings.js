const Listing = require('../modules/listing');

module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});
    res.render('listings/index.ejs',{allListings});
}

module.exports.newListings = async(req,res,next)=>{
        let listing = req.body;
        listing.owner = req.user._id;
        const newListing = new Listing(listing);
        await newListing.save()
        req.flash("success", "New Listing created!");
        res.redirect('/listings');
}

module.exports.newListingsForm = async(req,res)=>{
    res.render('listings/new.ejs',);
}

module.exports.getListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews" , populate: {path: 'author'}}).populate("owner");
    res.render('listings/show.ejs',{listing});
}

module.exports.editListingForm = async(req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs',{listing});
}

module.exports.editListing = async(req,res)=>{
    let {id} = req.params;
    let listing = {...req.body.listing};
    await Listing.findByIdAndUpdate(id, listing);
    req.flash("success","Listing successfully edited.") 
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing successfully Deleted.") 
    res.redirect('/listings'); 
}
