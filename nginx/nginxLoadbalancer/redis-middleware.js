const redis = require("redis");

const client = redis.createClient();
client.connect("redis://localhost:6379");
client.on('error', (err) => console.error(err));

function redisMiddleware(err, req, res, next) {
    switch (req.url) {
        case "/posts":
            if (err) res.status(500).send("<h4>Something went wrong!</h4>");
            const postsData = client.get("posts");
            if(postsData != null) {
                res.send(postsData);
                    console.log("from redis!")
            } else {
                next();
            }          
            break;
        case "/users":
            if (err) res.status(500).send("<h4>Something went wrong!</h4>");
            const usersData = client.get("users");
            if(usersData != null) {
                res.send(usersData);
                    console.log("from redis!")
            } else {
                next();
            }            
            break;
        case "/comments":
            if (err) res.status(500).send("<h4>Something went wrong!</h4>");
            const commentsData = client.get("comments");
            if(commentsData != null) {
                res.send(commentsData);
                    console.log("from redis!")
            } else {
                next();
            }   
            break;
    }
}

module.exports = redisMiddleware;