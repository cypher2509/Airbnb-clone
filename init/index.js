const Listing = require('../modules/listing');
const mongoose = require ('mongoose');
const listingData = require('./data')

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

async function initDB(){
  await Listing.deleteMany({});
  listingData.data = listingData.data.map((obj)=>({...obj, owner: "67bd02869858933b403b3b01"}))
  await Listing.insertMany(listingData.data);
}

initDB();