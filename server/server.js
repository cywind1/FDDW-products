// requiring packages
const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product_model.js');
const cors = require('cors');

// creating express server
const app = express();

// set port to listen for requests
const port = process.env.PORT || 3000;
const MongodbURI = "mongodb+srv://enki-admin-cart:enki1234@cluster0.5xz0p.mongodb.net/enki-products?retryWrites=true&w=majority"

// creating express server
app.use(express.json());

// avoid CORS errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Credentials');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DEL, OPTION, HEAD');
    next();
});

const corsWhitelist = [
    'http://127.0.0.1:3000/',
    'https://enki-bookstore.herokuapp.com/',
    'https://enki-cart.herokuapp.com/'
];

// setting cors options
var corsOptions = {
    origin: ['https://enki-bookstore.herokuapp.com','https://enki-cart.herokuapp.com', 'https://enki-store.herokuapp.com'],
    optionsSuccessStatus: 200 
}

app.use(cors(corsOptions));

// connection to database
mongoose.connect(MongodbURI, { useNewUrlParser: true, useUnifiedTopology: true })
// listen only after connected with db
    .then((result) => app.listen(port, () => 
    console.log(`Listening on port ${port}...`)))
    .catch((err) => console.log(err));

// GET Product Service
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
    // access all instances of product in our collection, 
    Product.findById(req.params.id)
    // and send them back to the response as JSON
    .then(product => res.json(product))
    .catch(err => res.status(400).json("Error: " + err))
});

// GET books with genre
app.get('/books/genres/:genre', (req, res) => {
    const the_genre = req.params.genre;    
    console.log(the_genre);
    Product.find( { genre: the_genre })
    .then(results => {
        let data = { "book_results": results };
        res.send(data);
    }).catch(err => res.status(400).json("Error: " + err))
});

//UPDATE the "available" of the products that are bought
app.put('/books', (req, res) => {
    const products = req.body.sold;
    products.forEach((product) => {
    // product[0] = id , product[1] = sold quantity     
        Product.findById(product[0]).then((the_product)=>{
            const new_value = parseInt(the_product.available) - parseInt(product[1]);
            Product.findOneAndUpdate({_id : product[0]}, { available: new_value },{ returnOriginal: false}).then((update)=>{
                if(products.indexOf(product) == products.length-1){
                      res.status(200).send("Update complete");
                }
            }).catch(err => res.status(400).json("Error: " + err));
        });
    });
});

