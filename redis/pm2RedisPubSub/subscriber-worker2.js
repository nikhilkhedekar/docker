const redis = require("redis");

const fibonacciSeriesObj = require("./fibonacci-series");

const subscriber = redis.createClient();
subscriber.connect("redis://localhost:6379");
subscriber.on('error', (err) => console.error(err));

subscriber.subscribe("math-subscription2", (message) => {
    let seriesValue = fibonacciSeriesObj.calculateFibonacciValue(Number(message));
    console.log(`Fibonacci series value is ${seriesValue}`);
});