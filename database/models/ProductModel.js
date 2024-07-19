const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    categoryName:{
      type:String,
      required:true,
    },
    name: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    img: {
      type: String,
      required: true
    },
    images: [{
      type: String,
      required:true
    }],
    viewCount: {
      type: Number,
      default: 0
    },
    addedDate: {
      type: Date,
      default: Date.now
    }
  
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;


