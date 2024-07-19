const express = require("express");
const { getAllCategories , createCategory , singleCategory, deleteCategory } = require("../controllers/CategoryController");
const categoryRouter = express.Router() ;


// route for all categories
categoryRouter.get("/allcategories" ,getAllCategories)


// route for creating a category
categoryRouter.post("/create/category",createCategory)


// route for single category
categoryRouter.get("/singlecategory/:id",singleCategory)


// route for delete a category
categoryRouter.delete("/delete/:id",deleteCategory)



module.exports = {
    categoryRouter
}