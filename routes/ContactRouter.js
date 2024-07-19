const express = require("express");

const { getContactRequest, productContact } = require("../controllers/ContactController");
const contactRouter = express.Router()






contactRouter.post("/", getContactRequest  )
contactRouter.post("/specificProduct", productContact  )

module.exports = {contactRouter}