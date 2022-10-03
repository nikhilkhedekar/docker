const mongoose = require("mongoose");

const connectToDB = async () => {
    // const connect = await mongoose.connect("mongodb://127.0.0.1:27017/2FASpeakEasy?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4");
    const connect = await mongoose.connect("mongodb+srv://Dhungel:Dhungel@awsdhungel.oevqe.mongodb.net/AWSDhungel?retryWrites=true&w=majority")
    //--network mongo_nw
    //--name mongo_first_nw = mongo%5Ffirst%5Fnw 
    // const connect = await mongoose.connect("mongodb://mongo%5Ffirst%5Fnw:27017/2FASpeakEasy?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4");
    console.log(`MongoDB connected: ${connect.connection.host}`);
};

module.exports = connectToDB;