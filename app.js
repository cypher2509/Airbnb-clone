const express =  require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

const listings = require("./routes/listing.js")
const reviews = require("./routes/reviews.js")

const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const flash = require('connect-flash');

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

let sessionOptions = {
    secret: 'mysecretcode',
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 1000*60 *60*24* 7,
        maxAge: 1000*60 *60*24*3,
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    next();
})
//server initialisation
app.listen(8080, ()=>{
    console.log('listening to port 8080');
    console.log('server started at http://localhost:8080/')
})


app.get('/',(req,res)=>{
    res.send('I am groot!');
})

app.use('/listings',listings)
app.use('/listings/:id/reviews', reviews)


//throwing error if no http request found
app.all('*', (req,res,next)=>{
    next(new ExpressError(404, 'Page Not Found'));
})

// error handlers and rendering error page
app.use((err,req,res,next)=>{
    let{statusCode = 500, message ='something went wrong'} = err;
    res.render('listings/error.ejs',{message})
});