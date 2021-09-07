//MONGOOSE
const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const session = require('express-session');
var path = require('path');
const app = express();
app.use(express.static("src"));
const MongodbURI = "mongodb+srv://enki-admin-cart:enki1234@cluster0.5xz0p.mongodb.net/enki-products?retryWrites=true&w=majority"
const product = require('./models/product_model.js');

mongoose.connect(MongodbURI, {useNewUrlParser: true, useUnifiedTopology : true})
.then((result) => app.listen(port, () => console.log(`Listening on port ${port}...`)))
.catch((err) => console.log(err));

//Product Service
 app.get('/product', (req, res) => {

Product.find().then((result)=>{
    res.send(result);
}).catch((err)=>{
    console.error(err);
})
});


app.put('/books', (req, res) => {
    //update the "available" of the products that are bought
    const products = req.body.sold;
    products.forEach((product) => {
        
    // 1. Product 

    });
});

// noch Error: Cannot find module 'cookie-session, Require stack

// //OTHER functions
// function generateRandomID() {
//     let randomNumber = Math.random().toString();
//     randomNumber = randomNumber.substring(2, randomNumber.length);
//     return randomNumber;
// }

const port = process.env.PORT || 3000;