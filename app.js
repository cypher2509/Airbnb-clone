const express =  require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Listing = require('./modules/listing');
const Review = require('./modules/review');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError.js')
const {listingSchema} = require('./schema.js');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'/public')));
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);
main().catch(err => console.log(err));


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

//validations
const validateListing = (req,res, next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);;
    }
}

//server initialisation
app.listen(8080, ()=>{
    console.log('listening to port 8080');
    console.log('server started at http://localhost:8080/')
})


app.get('/',(req,res)=>{
    res.send('I am groot!');
})

//listings
//getting listings
app.get('/listings',wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render('listings/index.ejs',{allListings});
}));
//posting listings
app.post('/listings', validateListing, wrapAsync(async(req,res,next)=>{
        let listing = req.body;
        const newListing = new Listing(listing);
        await newListing.save()
        res.redirect('/listings');
    
}));

//getting form listing page
app.get('/listings/new',wrapAsync(async(req,res)=>{
    res.render('listings/new.ejs',);
}));

//showing the listing
app.get('/listings/:id', wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/show.ejs',{listing});
}));

//getting form to edit listing 
app.get('/listings/:id/edit', wrapAsync(async(req,res,next)=>{
        let {id} = req.params;
        const listing = await Listing.findById(id);
        res.render('listings/edit.ejs',{listing});

}));

//modifying the listing
app.put('/listings/:id', wrapAsync(async(req,res)=>{
        let {id} = req.params;
        let listing = {...req.body.listing};
        console.log(listing);
        await Listing.findByIdAndUpdate(id, listing);
        res.redirect('/listings');
}));

//deleting the listing
app.delete('/listings/:id',wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings'); 
}));

//reviews
//posting reviews

app.post('/listings/:id/reviews', wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let review = new Review(req.body.review);
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    res.redirect('/listings/'+req.params.id);
}))

//throwing error if no http request found
app.all('*', (req,res,next)=>{
    next(new ExpressError(404, 'Page Not Found'));
})

// error handlers and rendering error page
app.use((err,req,res,next)=>{
    let{statusCode = 500, message ='something went wrong'} = err;
    res.render('listings/error.ejs',{message})
});