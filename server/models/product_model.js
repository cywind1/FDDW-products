const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const product_schema = new Schema({
    product_id: {
        type: String,
        required: true
      },
    title: {
        type: String,
        required: true
      },
    // array in String
    author: {
        type: [String],
        required: true
      },
    genre: {
        type: String,
        required: true
      },
    published: {
        type: String,
        required: true
      },
    pages: {
        type: String,
        required: true
      },
    price: {
        type: String,
        required: true
      },
    currency: {
        type: String,
        required: true
      },
    photo: {
        type: String,
        required: true
      },
    description: {
        type: String,
        required: true
      },
    available: {
        type: String,
        required: true
      },
},{timestamps:true});

const Product = mongoose.model('Product', product_schema);
module.exports = Product;