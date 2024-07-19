const express = require("express");
const { Banner } = require("../database/models/BannerModel");
const { getBannerImages, addBannerImage } = require("../controllers/BannerController");
const bannerRouter = express.Router()




bannerRouter.get("/", getBannerImages  )



bannerRouter.post("/", addBannerImage  )

module.exports = {bannerRouter}