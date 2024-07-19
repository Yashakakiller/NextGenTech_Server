const Product = require("../database/models/ProductModel")
const Category = require("../database/models/CategoryModel");





// Create a new product and associate it with a category
const createProduct = async (req, res) => {
  const { category, name,desc,img, price, quantity ,addedDate,images } = await req.body;


  try {
    const customDate = new Date(addedDate);
    const categoryCheck = await Category.findOne({ name: category }).maxTimeMS(20000);
    //console.log(categoryCheck)
    if (!categoryCheck) {
      return res.json({ success: false, message: 'Category not found' });
    }

    const productCheck = await Product.findOne({ name }).maxTimeMS(20000);
    if (productCheck) {
      return res.json({ success: false, message: 'Product already exists' });
    }
    const newProduct = await Product.create({ category: categoryCheck._id, name, desc ,img ,price, quantity,categoryName:categoryCheck.name,addedDate: customDate,images});
    res.status(200).json({ success: true, product: newProduct, message: 'New Product created' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};







const newArrivals = async(req,res) => {
  try {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Query to find products added in the last 7 days
  const query = {
    addedDate: { $gte: sevenDaysAgo }
  };

  // Find products based on the query
  Product.find(query)
    .exec()
    .then(products => {
      res.status(200).json({success:true,products});
    })
    .catch(error => {
      res.status(500).json({ error: error.message , success:false });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}




// Get all products with their associated category
const getProductsByCategory = async (req, res) => {
  const { category,page  } = req.query;
  const pageNumber = parseInt(page) || 1;
  const limitNumber = 10;

  try {
    const categoryCheck = await Category.findOne({ name: category }).maxTimeMS(20000);
    if (!categoryCheck) {
      return res.json({ success: false, message: 'Category not found' });
    }

    const filterProducts = { category: categoryCheck._id };
    const totalCount = await Product.countDocuments(filterProducts);
    const totalPages = Math.ceil(totalCount / limitNumber);

    const products = await Product.find(filterProducts)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber).maxTimeMS(20000);

    res.json({ success: true, products, totalPages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};









// delete a product
const deleteProduct = async (req, res) => {
  try {
  const { id } = req.params;
  const product = await Product.findById(id).maxTimeMS(20000);
  if (!product) {
    return res.json({ success: false, message: "Product Not Found" })
  }
  await Product.findByIdAndDelete(id).maxTimeMS(20000);
  res.status(200).json({ success: true, message: "Product Deleted Successfully" })
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}









//fetching all products
const allProducts = async (req, res) => {
  const { page  } = req.query;
  const pageNumber = parseInt(page) || 1;
  const limitNumber = 10; // NO OF PRODUCTS IN SINGLE PAGE

  try {
    
    const totalCount = await Product.countDocuments(); // fetch all product
    const totalPages = Math.ceil(totalCount / limitNumber); // total pages

    const products = await Product.find()
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber).maxTimeMS(20000); //This part of the code skips a certain number of documents based on the current page number and the limit of documents per page. For example, if pageNumber is 1 and limitNumber is 10, it will skip 0 documents. If pageNumber is 2, it will skip 10 documents (i.e., it will start from the 11th document). This is typically used for pagination.

    res.json({ success: true, products, totalPages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}









// random product from random category
const randomProduct = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

   
    const query = {
      addedDate: { $lte: sevenDaysAgo }
    };

    const categories = await Category.find({}).maxTimeMS(20000); // Get all categories
    const randomProducts = []; 

    for (const category of categories) {

      const productsInCategory = await Product.find(
        { category: category._id, ...query } // Specify the fields you want to include
      ).maxTimeMS(20000);

      // Check if there are products in the current category
      if (productsInCategory.length > 0) {
        // Get a random product from the products in the current category
        const randomProduct = productsInCategory[Math.floor(Math.random() * productsInCategory.length)];
        randomProducts.push(randomProduct);
      }
    }

    res.json({ randomProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};










// fetch single product by id
const singleProduct = async (req,res) => {
  try {
  const {id} = req.params ;
  const checkProduct = await Product.findById(id).maxTimeMS(20000);
  if(!checkProduct){
    return res.json({success:false , message:"No product found"});
  }
  checkProduct.viewCount+=1
  checkProduct.save()
  res.json({success:true , product:checkProduct})
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}




const relatedProducts = async (req,res) => {
  try {
    const {id} = req.params;
  const checkProduct = await Product.findById(id).maxTimeMS(20000);
  if(!checkProduct){
    return res.json({success:false , message:"No product found"});
  }
  const relatedProducts = await Product.find({ _id: { $ne: id } ,category:checkProduct.category}).limit(4).maxTimeMS(20000);
  res.json({success:true,relatedProducts})
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}





const searchProduct = async (req, res) => {
  const { query } = req.query;
  try {
    let products;

    // Check if query matches any category
    const categoryCheck = await Category.findOne({ name: { $regex: new RegExp(query, 'i') } }).maxTimeMS(20000);
    if (categoryCheck) {
      // If category found, fetch products for that category
      products = await Product.find({ category: categoryCheck._id }).maxTimeMS(20000);
    } else {
      // Otherwise, treat query as product name and search for products
      const regex = new RegExp(query, 'i');
      products = await Product.find({ name: regex }).maxTimeMS(20000);
    }

    if (products.length === 0) {
      res.status(404).json({ success: false, message: 'No products found. Try something else.' });
    } else {
      res.status(200).json({ success: true, products });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};














module.exports = {
  getProductsByCategory,
  createProduct,
  deleteProduct,
  allProducts,
  randomProduct,
  singleProduct,
  relatedProducts,
  searchProduct,
  newArrivals
}