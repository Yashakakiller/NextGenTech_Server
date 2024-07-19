const { Banner } = require("../database/models/BannerModel")


const getBannerImages = async (req, res) => {
    try {
      const bannerImages = await Banner.find({}).lean();
      res.json({ success: true, bannerImages });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  

  const addBannerImage = async (req, res) => {
    try {
        // Extracting the 'bannerImage' from the request body
        const { bannerImage } = req.body;

        // Check if the 'bannerImage' field exists in the request body
        if (!bannerImage) {
            return res.status(400).json({ success: false, message: "Banner Image is required" });
        }

        // Assuming 'Banner' is a Mongoose model, create a new banner image
        const bannerNewImage = await Banner.create({ bannerImage });

        // Respond with success and the created banner image
        res.status(201).json({ success: true, bannerNewImage });
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ success: false, message: error.message });
    }
};




module.exports= {
    getBannerImages,
    addBannerImage
}