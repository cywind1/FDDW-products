//MONGOOSE
const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const session = require('express-session');
var path = require('path');
const app = express();
app.use(express.static("src"));
const port = process.env.PORT || 3000;
const MongodbURI = "mongodb+srv://enki-admin-cart:enki1234@cluster0.5xz0p.mongodb.net/enki-products?retryWrites=true&w=majority"
const product = require('./models/product_model.js');
const Product = require('./models/product_model.js');

mongoose.connect(MongodbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(port, () => console.log(`Listening on port ${port}...`)))
    .catch((err) => console.log(err));

//Product Service
app.get('/books', (req, res) => {
    Product.find().then((result) => {
        res.send(result);
    }).catch((err) => {
        console.error(err);
    })
});

app.put('/books', (req, res) => {
    //TO TEST
    //update the "available" of the products that are bought
    const products = req.body.sold;
    products.forEach((product) => {
        Product.findById(product[0]).then((the_product)=>{
            const new_value = parseInt(the_product.available) - parseInt(product[1]);
            Product.findOneAndUpdate({_id : cookies.product[0]}, { available: new_value },{ returnOriginal: false}).then((update)=>{
                console.log(update);
            });
        });
    });
});



//TODO

// app.get('/books/:id', (req, res) => {
//     //send only a specific book
//     const book_id = req.params.id;
//     console.log(book_id);
//     db_connectAndDo(db_findElementById, false, db_collection_products, db_enki_products, book_id)
//         .then((result) => {
//             res.send(result);
//         });
// });

// app.get('/books/:genre', (req,res)=>{
//     const the_genre = req.params.genre;
//     const the_filter = { 'genre': the_genre };
//     //console.log(the_filter);
//     db_connectAndDo(db_findByFilter, false, db_collection_products, db_enki_products, {genre : the_genre}).then((result)=>{
//         res.send(result);

//     });
// });



