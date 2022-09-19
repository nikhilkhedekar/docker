const express = require("express");
const cors = require("cors");

const jphRoutes = require("./jph-routes");
const PORT = 8080;

const app = express();

app.use(cors());
app.use(express.json());
app.use("/jph",jphRoutes);

app.get("/", (req,res) => {
    res.send(`Server is running on PORT : ${PORT}`);
})
app.listen(PORT, () => console.log(`Server is running on PORT : ${PORT}`));

//loadtest -n 1000 -c 100 --rps 200 http://localhost:3000/jph/posts
//loadtest -n 1000 -c 100 --rps 200 http://localhost:3000/jph/comments
//loadtest -n 1000 -c 100 --rps 200 http://localhost:3000/jph/users