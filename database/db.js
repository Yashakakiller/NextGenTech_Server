const mongoose = require("mongoose");

const Connection = async () => {
    await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log("database connected");
}

module.exports = {
    Connection
}