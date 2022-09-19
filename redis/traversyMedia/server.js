const express = require("express");
const redis = require("redis");
// const { Client } = require("redis-om");
const axios = require("axios");

const app = express();

app.use(express.json());
// app.use(express.urlencoded({extended: false}));

const client = redis.createClient();
client.connect("redis://localhost:6379");
client.on('error', (err) => console.error(err));

// const url = "redis://localhost:6379"
// const client = new Client().open(url) 

const cache = async (req, res, next) => {
    const { username } = req.params;
    const data = await client.GET(username);
    if(data != null)res.status(200).json(data);
    next();
}

const getUser = async (req, res) => {
    try {
        const { username } = req.params
    const userData = await axios.get(`https://api.github.com/users/${username}`);
    client.SET("user", username)
    res.status(200).json({
        message: "success",
        payload: userData.data
    });
    }catch (err) {
        console.log(err);
    }
}

app.get("/:username",cache, getUser);

app.get("/", (req, res) => {
    res.send("hello redis");
})

app.listen(8080, () => {
    console.log("listening on 8080");
})