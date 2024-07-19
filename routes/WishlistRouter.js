const express = require('express');
const { addToWishlist, deleteFromWishlist } = require('../controllers/WishlistController');
const wishlistRouter = express.Router()


wishlistRouter.post("/user/:id",addToWishlist)


wishlistRouter.delete('/user/:id',deleteFromWishlist)

module.exports = {
    wishlistRouter
}