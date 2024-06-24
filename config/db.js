const mongoose = require('mongoose');

const ConnectDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("connected to MongoDB")
    }catch(err){
        console.log("Failed to Connect to MongoDB");
    }
}

module.exports = ConnectDB;
