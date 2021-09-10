// packages
const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product_model.js');
const cors = require('cors');

// creating express server
const app = express();

// connections
const port = process.env.PORT || 3000;
const MongodbURI = "mongodb+srv://enki-admin-cart:enki1234@cluster0.5xz0p.mongodb.net/enki-products?retryWrites=true&w=majority"

app.set('trust proxy', 1) ;// trust first proxy

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Credentials');
    // Cookie -> res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DEL, OPTION, HEAD');
    next();
});

const corsWhitelist = [
    'https://enki-bookstore.herokuapp.com/',
    'https://enki-cart.herokuapp.com/'
];
var corsOptions = {
    origin: function (origin, callback) {
        if (corsWhitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204,
}

app.use(cors(corsOptions));

mongoose.connect(MongodbURI, { useNewUrlParser: true, useUnifiedTopology: true })
// listen only after connected with db
    .then((result) => app.listen(port, () => 
    console.log(`Listening on port ${port}...`)))
    .catch((err) => console.log(err));

//Product Service
app.get('/', (req, res) => {
        res.status(200).send("Enki Product Page");
    });

// GET all books
app.get('/books', (req, res) => {
    Product.find().then((results) => {
        let data = { "book_results": results }
        res.send(data);

    }).catch((err) => {
        console.error(err);
    });
});

// GET a book with id
app.get('/books/:id', (req, res) => {
    Product.findById(req.params.id)
    // access all instances of product in our collection, 
    // and send them back to the response as JSON
    .then(product => res.json(product))
    .catch(err => res.status(400).json("Error: " + err))
});

// GET books with genre
app.get('/books/genre/:genre', (req, res) => {
    const the_genre = req.params.genre;    
    console.log(the_genre);
    Product.find( { genre: the_genre })
    .then(product => res.json(product))
    .catch(err => res.status(400).json("Error: " + err))
});

//UPDATE the "available" of the products that are bought
app.put('/books', (req, res) => {
    const products = req.body.sold;
    products.forEach((product) => {
    // product[0] = id , product[1] = sold quantity     
        Product.findById(product[0]).then((the_product)=>{
            const new_value = parseInt(the_product.available) - parseInt(product[1]);
            Product.findOneAndUpdate({_id : product[0]}, { available: new_value },{ returnOriginal: false}).then((update)=>{
                // console.log(update);
                res.status(200).send();
            }).catch(err => res.status(400).json("Error: " + err));
        });
    });
});

// Lesson 1: 
// then Situation: 1/ res.status(200).send(); 2/ JSON
// Lesson 2: 
// one path, one GET -> CastError: Cast to ObjectId failed for value \"Cookbooks\" (type string) 