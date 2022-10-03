const express = require("express");
const cookieParser = require("cookie-parser");

const connectToDB = require("./database/db");
const ErrorsMiddleware = require("./middleware/mongooseErrorHandler");
const authRoutes = require("./routes/authRoutes");

process.on("uncaughtException", (error) => {
    console.log("Uncaught Exception....💣 🔥 stopping the server...");
    console.log(error.name, error.message);
    process.exit(1);
});

const app = express();

connectToDB();

app.use(express.json());
app.use(cookieParser());
app.use(ErrorsMiddleware);

app.get("/", (req, res) => {
    res.send("speak easy")
});
app.use("/api/v1/", authRoutes);

app.listen(80, () => {
    console.log("listening on 80")
});

process.on("unhandledRejection", (error) => {
    console.log("Unhandled Rejection....💣 🔥 stopping the server...");
    console.log(error.name, error.message);
    server.close(() => {
        process.exit(1);
    });
});