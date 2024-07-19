const User = require("../database/models/UserModel")

const addToWishlist = async (req, res) => {
    try {
      const { id } = req.params;
      const productId = req.body._id;
  
      const user = await User.findById(id).maxTimeMS(20000);
      if (!user) {
        return res.json({ success: false, message: "User not found" });
      }
  
      if (user.wishlist.includes(productId)) {
        return res
          .status(400)
          .json({ success: false, message: "Product already in wishlist" });
      }
  
      user.wishlist.unshift(productId);
      await user.save();
  
      res.json({ success: true, message: "Product added to wishlist" });
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  };
  

  const deleteFromWishlist = async (req, res) => {
    try {
      const { id } = req.params;
      const { _id } = await req.body;
      
      const userCheck = await User.findById(id).maxTimeMS(20000);
      if (!userCheck) {
        return res.json({ success: false, message: 'User Not Found' });
      }
      
      if (!userCheck.wishlist.includes(_id)) {
        return res.status(400).json({ error: 'Product not found in wishlist' });
      }
      
      userCheck.wishlist.pull(_id);
      await userCheck.save();
      
      res.json({ success: true, message: 'Product removed from wishlist' });
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  };
  


  module.exports = {
    addToWishlist,
    deleteFromWishlist
  };
  