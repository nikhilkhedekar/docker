const express = require("express");
const redis = require("redis");

const redisMiddleware = require("./redis-middleware");

const usersApi = require("./jph-users-api");
const postsApi = require("./jph-posts-api");
const commentsApi = require("./jph-comments-api");

const routes = express.Router();

routes.use(redisMiddleware);

const client = redis.createClient();
client.connect("redis://localhost:6379");
client.on('error', (err) => console.error(err));

routes.get("/posts", (request, response) => {
    postsApi.fetchPosts().then(
        data => {
            // console.log(`Data Fetched from Server with process ID - ${process.pid}`);
            client.SET("posts", JSON.stringify(data.data));
            response.send(data.data);
        },
    ).catch(error => {
        console.log("Error :", error);
        response.status(500).send("Something went wrong!")
    })
});
routes.get("/comments", (request, response) => {
    commentsApi.fetchComments().then(
        data => {
            // console.log(`Data Fetched from Server with process ID - ${process.pid}`);
            client.setEx("comments", 300, JSON.stringify(data.data));
            response.send(data.data);
        },
    ).catch(error => {
        console.log("Error :", error);
        response.status(500).send("Something went wrong!")
    })
});
routes.get("/users", (request, response) => {
    usersApi.fetchUsers().then(
        data => {
            // console.log(`Data Fetched from Server with process ID - ${process.pid}`);
            client.set("users",JSON.stringify(data.data));
            response.send(data.data);
        },        
    ).catch(error => {
        console.log("Error :", error);
        response.status(500).send("Something went wrong!")
    })
});
module.exports = routes;