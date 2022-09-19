const express = require("express");
const redis = require("redis");

const app = express();

const client = redis.createClient();
client.connect("redis://localhost:6379");
client.on('error', (err) => console.error(err));

app.get("/", (request, response) => {
    console.log(`Process ID is ${process.pid}`);
    let num = request.query.number;
    if (num % 2 == 0) {        
        client.publish("math-subscription1", num);
    }
    else {
        client.publish("math-subscription2", num);
    }
    response.send("<h3>Notification sent to the respective subscribers! We will send you an email with the details!</h3>");
});

app.listen(3000, () => console.log("Express App is running on PORT : 3000"));