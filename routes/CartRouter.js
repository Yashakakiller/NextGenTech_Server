const express = require("express");
const { addToCart, deleteFromCart, placeOrder } = require("../controllers/CartController");

const cartRouter = express.Router();


cartRouter.post("/user/:id",addToCart);

cartRouter.delete("/user/:id/:_id", deleteFromCart);

cartRouter.post("/place_order/:id", placeOrder)


module.exports = {
    cartRouter
}