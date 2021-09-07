const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const product_schema = new Schema({
    product_id: String,
    title: String,
    // array in String
    author:[String],
    genre: String,
    published: String, 
    pages: String,
    price: String,
    currency: String, 
    photo: String,
    description: String,
    available: String
},{timestamps:true});

const Product = mongoose.model('Product', product_schema);
module.exports = Product;