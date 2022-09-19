const express = require("express");
const cluster = require("cluster");
const totalCPUs = require('os').cpus().length;

const fabObj = require("./fibonacciSeries");
if (cluster.isMaster) {
    
    console.log(`Total Number of CPU Counts is ${totalCPUs}`);

    for (var i = 0; i < totalCPUs; i++) {
        cluster.fork();
    }
    cluster.on("online", worker => {
        console.log(`Worker Id is ${worker.id} and PID is ${worker.process.pid}`);
    });
    cluster.on("exit", worker => {
        console.log(`Worker Id ${worker.id} and PID is ${worker.process.pid} is offline`);
        console.log("Let's fork new worker!");
        cluster.fork();
    });
}
else {
    const app = express();
    app.get("/", (request, response) => {
        console.log(`Worker Process Id - ${cluster.worker.process.pid} has accepted the request!`);
        let number = fabObj.calculateFibonacciValue(Number.parseInt(request.query.number));
        response.send(`<h1>${number}</h1>`);
    });

    app.listen(3000, () => console.log("Express App is running on PORT : 3000"));
}

//loadtest:
//npm i -g loadtest
//-n number of requests
//-c number of concurrent request
//--rps request per second
//loadtest -n 1000 -c 100 --rps 200 http://localhost:3000/?number=10

//artillery:
//npm i -g artillery
//quick method
//-n no of request
//artillery quick --count 10 -n 20 http://localhost:3000/?number=10

//pm2 ( process management/loadbalancer ):
//npm i -g pm2
//pm2 ecosystem - to create config file for pm2 process
//pm2 link <hash> <hash> - to connect remote analysis
//pm2 start ecosystem.config.js
//pm2 monit - to monitor  
//https://app.pm2.io - UI
//pm2 stop all
//pm2 delete all 
//pm2 ui