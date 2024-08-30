const express =  require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Listing = require('./modules/listing');
const methodOverride = require('method-override');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.listen(8080, ()=>{
    console.log('listening to port 8080');
})

app.get('/',(req,res)=>{
    res.send('I am groot!');
})

app.get('/listings',async(req,res)=>{
    const allListings = await Listing.find({});
    res.render('listings/index.ejs',{allListings});
})

app.get('/listings/:id', async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/show.ejs',{listing});
})

app.post('/listings/new', async(req,res)=>{
    let listing = req.body;
    const newListing = new Listing(listing);
    await newListing.save()
    res.redirect('/listings');
})

app.get('/listings/new',async(req,res)=>{
    res.render('listings/new.ejs',);
})

app.get('/listings/:id/edit', async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('listings/edit.ejs',{listing});
})

app.put('/listings/:id', async(req,res)=>{
    let {id} = req.params;
    let listing = {...req.body.listing};
    console.log(listing);
    await Listing.findByIdAndUpdate(id, listing);
    res.redirect('/listings'); 
})

app.delete('/listings/:id',async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings'); 
})