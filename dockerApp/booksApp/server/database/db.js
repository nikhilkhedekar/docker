const mongoose = require("mongoose");

const connectToDB = async () => {
    const connect = await mongoose.connect("mongodb://127.0.0.1:27017/booksApp?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4");
    console.log(`MongoDB connected: ${connect.connection.host}`);
};

module.exports = connectToDB;