const Listing = require('../modules/listing');
const mongoose = require ('mongoose');
const listingData = require('./data')

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
 Listing.insertMany(listingData.data);
