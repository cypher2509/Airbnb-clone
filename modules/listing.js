const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let listingSchema = new Schema({
    title:{
        type:String,
        required: true,
    },
    description: String,
    image:{
        type: String,
        default: 'https://unsplash.com/photos/a-building-with-a-bunch-of-plants-in-front-of-it-8rjHn0ScNNY',
        set: (v)=>
            v ==="" ? 'https://unsplash.com/photos/a-building-with-a-bunch-of-plants-in-front-of-it-8rjHn0ScNNY'
            :v,
        },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref : 'Review'
        }
    ]
})

const Listing = mongoose.model('Listing',listingSchema);

module.exports = Listing;