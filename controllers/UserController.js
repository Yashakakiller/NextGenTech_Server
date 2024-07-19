const jwt = require("jsonwebtoken");
const User = require("../database/models/UserModel")
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");


// fetch all users
const allUsers = async (req, res) => {
    try {
        const users = await User.find({}).maxTimeMS(20000);
        res.json(users)
    } catch (error) {
        res.status(400).json({ message: "Some Internal Server Problem" })
    }
}




// create user
const createUser = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.message });
    }

    const { firstName,lastName, email, address,gender, phone, password,img } = await req.body;

    try {
        const userCheck = await User.findOne({ email }).maxTimeMS(20000);
        if (userCheck) {
            return res.json({success:false , message: 'Email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            firstName,
            lastName,
            img,
            email,
            address,
            gender,
            phone,
            password: hashedPassword
        });


        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY );
        res.status(200).json({ success: true, message: "User Created Successfully" ,user , token})



    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};





// delete user
const deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
  
      const user = await User.findById({_id:id}).maxTimeMS(20000);
      if (!user) {
        return res.json({ message: "User not found" });
      }
  
      await User.findByIdAndDelete(id).maxTimeMS(20000);
  
      res.json({ message: "User Deleted Successfully" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
  






// update a single User
const updateUser = async (req, res) => {
    try {
        const id = await req.params.id;

        const user = await User.findById(id).maxTimeMS(20000);
        if (!user) {
            return res.json({ message: "User Not Found" });
        }

        const { firstName,lastName, email, phone, address ,img ,gender} = req.body;

        await User.updateOne({ _id: id }, { $set: { firstName,lastName,img, email,gender, phone, address } });

        res.json({ message: "User Updated Successfully" });
    } catch (error) {
        if (error.name === "CastError") {
            return res.json({ message: "Invalid User Id" });
        }
        res.status(500).send("Internal Server Error");
    }
};






// fetching a single User
const singleUser = async (req, res) => {
    try {
        const { id } = await req.params;
        const user = await User.find({ _id: id }).maxTimeMS(20000)
        res.json({user,success:true})
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
}





//  user login with authentication
const userLogin = async (req, res) => {
    try {
        const { email, password } = await req.body;
        const user = await User.findOne({ email }).maxTimeMS(20000);
        if (!user) {
            return res.json({ success:false,message: "User Not Found" });
        }

        const comparePassword = await bcrypt.compare(password, user.password);

        if (!comparePassword) {
            return res.json({ success:false,message: "Please enter correct credentials" });
        }
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET_KEY );

        res.json({ status: "ok", data: token ,user })
    } catch (error) {
        return res.status(400).json({ error: "Internal server error", message: error.message })
    }
};






//  fetching login users details
const loginUserDetail = async (req, res) => {
    try {
        const {token} = await req.headers
        const user = jwt.verify(token , process.env.JWT_SECRET_KEY);
        const userEmail = user.email ;
        const userData = await User.findOne({email:userEmail}).maxTimeMS(20000);
        if(!userData){
            return res.json({message:"please enter valid token"})
        }
        res.json({success:true,data:userData})
    } catch (error) {
        return res.status(400).json({ error: "Internal server error", message: error.message })
    }
}







// user image related functions
const imagePost = async (req, res) => {
    try {
      const { id, img } = req.body;
  
      const user = await User.findById(id).maxTimeMS(20000);
      if (!user) {
        return res.json({ message: "User Not Found" });
      }
  
      await User.updateOne({ _id: id }, { $set: { img } });
  
      res.json({success:true , message: "User Image Updated Successfully" });
    } catch (error) {
      if (error.name === "CastError") {
        return res.json({ message: "Invalid User Id" });
      }
      res.status(500).send("Internal Server Error");
    }
  }; 
const imageGet = async (req, res) => {
    try {
      const { id } = req.body;
      const user = await User.findById(id).maxTimeMS(20000);
      if (!user) {
        return res.json({ success: false, message: "User not found" });
      }
  
      res.json(user.img);
    } catch (error) {
      res.json({ message: "Error", error });
    }
  };
  


module.exports = {
    allUsers,
    createUser,
    deleteUser,
    updateUser,
    singleUser,
    userLogin,
    loginUserDetail,
    imagePost,
    imageGet
}