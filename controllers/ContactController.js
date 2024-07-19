const { Contact } = require("../database/models/ContactModel");
const nodemailer = require("nodemailer");

const getContactRequest = async (req, res) => {
  try {
    const { name, email, message } = await req.body;

    const personContact = await Contact.create({
      name,
      email,
      message
    });

    const mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${process.env.ADMIN_EMAIL_ADDRESS}`,
        pass: `${process.env.SMTP_GMAIL_PASSWORD}`
      }
    });

    const details = {
      from: `${process.env.ADMIN_EMAIL_ADDRESS}`,
      to: email,
      subject: "Thanks for Contacting Us!",
      html: `<h1>Hello ${name}</h1><br /> <p>Your message is: ${message}</p> <br/><hr/><h3>We will contact you as soon as possible</h3>`
    };

    try {
      const info = await mailTransporter.sendMail(details);
      //console.log("Message is sent");
    } catch (err) {
      //console.log("The error is: " + err.message);
    }

    res.json({ success: true, personContact });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


const productContact = async(req,res)=>{
  const {name , email} = await req.body
  try {
    const mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${process.env.ADMIN_EMAIL_ADDRESS}`,
        pass: `${process.env.SMTP_GMAIL_PASSWORD}`
      }
    });

    const details = {
      from: `${process.env.ADMIN_EMAIL_ADDRESS}`,
      to: email,
      subject: "Thanks for Contacting Us!",
      html: `<h1>Hello ${name}</h1><br /> <h3>We have got response form ${email} regarding Specific Product Requirement...<hr/> We will reach you out soon !</h3>`
    };

    
      const info = await mailTransporter.sendMail(details);
      
    
    res.json({success:true,info})
  } catch (error) {
      res.json({success:false,message:error.message})    
  }
}

module.exports = {
  getContactRequest,
  productContact
};
