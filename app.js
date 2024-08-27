const express =  require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

main().catch(err => console.log(err));

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.listen(8080, ()=>{
    console.log('listening to port 8080');
})

app.get('/',(req,res)=>{
    res.send('I am groot!');
})
