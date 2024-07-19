const express = require("express");
const { createProduct, getProductsByCategory, deleteProduct, allProducts, randomProduct, singleProduct, relatedProducts, searchProduct, newArrivals } = require("../controllers/ProductController");
const productRouter = express.Router()


// route for create product
productRouter.post('/createproduct', createProduct);


// route for get products
productRouter.get('/byCategory', getProductsByCategory);


// route for delete a product
productRouter.delete("/delete/:id",deleteProduct)


// route for fetching all products
productRouter.get("/allproducts",allProducts)


// route for random products from random category
productRouter.get("/bestDeal/product",randomProduct)


// route for getting single product by id
productRouter.get("/product/:id",singleProduct)


// route for getting related products
productRouter.get("/byname/:id",relatedProducts)



// route for searching a product by name
productRouter.get("/searchproduct/name",searchProduct)


productRouter.get("/newArrivals",newArrivals);






module.exports = {
    productRouter
}



