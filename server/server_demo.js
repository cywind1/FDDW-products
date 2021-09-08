// packages
const express = require('express');
const mongoose = require('mongoose');
// const product = require('./models/product_model.js');
const Product = require('./models/product_model.js');

// creating express server
const app = express();

// connections
const port = process.env.PORT || 3000;
const MongodbURI = "mongodb+srv://enki-admin-cart:enki1234@cluster0.5xz0p.mongodb.net/enki-products?retryWrites=true&w=majority"

mongoose.connect(MongodbURI, { useNewUrlParser: true, useUnifiedTopology: true })
// listen only after connected with db
    .then((result) => app.listen(port, () => 
    console.log(`Listening on port ${port}...`)))
    .catch((err) => console.log(err));

//Product Service
app.get('/books', (req, res) => {
    Product.find().then((result) => {
        res.send(result);
    }).catch((err) => {
        console.error(err);
    });
});

app.get('/books/:id', (req, res) => {
    Product.findById(req.params.id)
    // access all instances of product in our collection, 
    // and send them back to the response as JSON
    .then(product => res.json(product))
    .catch(err => res.status(400).json("Error: " + err))
});

app.put('/books', (req, res) => {
    //TO TEST
    //update the "available" of the products that are bought
    //?1
    const products = req.body.sold;
    //?2
    products.forEach((product) => {
    // product[0] = id , product[1] = available     
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

// TODO
app.get('/books/:genre', (req, res) => {
    const the_genre = req.params.genre;
    //?3
    console.log(the_genre);
    Product.find( { "genre": the_genre })
    .then(product => res.json(product))
    .catch(err => res.status(400).json("Error: " + err))
});

// CastError: Cast to ObjectId failed for value \"Cookbooks\" (type string) 

// app.get('/books/:genre', (req,res)=>{
//     const the_genre = req.params.genre;
//     const the_filter = { 'genre': the_genre };
//     //console.log(the_filter);
//     db_connectAndDo(db_findByFilter, false, db_collection_products, db_enki_products, {genre : the_genre}).then((result)=>{
//         res.send(result);

//     });
// });



