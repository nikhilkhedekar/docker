const express = require("express");
// const fs = require('fs').promises;//use this for fs.writeFile
const fs = require('fs');//createwritestream 
const exists = require('fs').exists;
const path = require('path');
const axios = require("axios");
const mongoose = require("mongoose");
const morgan = require('morgan');
const cors = require("cors");
// require('dotenv').config();

const Favorite = require("./schema/schema");
const Goal = require('./schema/goals');

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'access.log'),
  { flags: 'a' }
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use('/feedback', express.static('feedback'));//to create static files
app.use(morgan('combined', { stream: accessLogStream }));

//mongo atlas
// mongoose.connect("mongodb+srv://Dhungel:Dhungel@awsdhungel.oevqe.mongodb.net/AWSDhungel?retryWrites=true&w=majority");

//you can use ip address too see section 73
// mongoose.connect("mongodb://127.0.0.1:27017/swapiFav?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4");
//to communicate dockers interally or locally with no ip you have to use this domain 
// mongoose.connect("mongodb://host.docker.internal:27017/swapiFav?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4");
//create new network for communication e.g mongo and node mean two servers
//url encoded = mongodb%5Ffirst  : url decoded mongodb_first
//--network mongodb@first
//--name mongodb_first
// mongoose.connect("mongodb://mongodb%5Ffirst:27017/swapiFav?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4")
//running all server on one network
//--network mongo_nw
//--name mongo_first_nw = mongo%5Ffirst%5Fnw 
mongoose.connect("mongodb://mongo%5Ffirst%5Fnw:27017/swapiFav?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4");
//===== render ========================================================================

// app.post("/postDockerData", (req, res) => {
//   let renderData = "initData";
//   renderData = req.body.data;
//   res.send({
//     message: `render updated ${renderData}`
//   })
// })

//===== create text file ===================================================================

// app.post('/create', async (req, res) => {
//   const title = req.body.title;
//   const content = req.body.text;

//   const adjTitle = title.toLowerCase();

//   const tempFilePath = path.join(__dirname, 'temp', adjTitle + '.txt');
//   const finalFilePath = path.join(__dirname, 'feedback', adjTitle + '.txt');

//   await fs.writeFile(tempFilePath, content);
//   exists(finalFilePath, async (exists) => {
//     if (exists) {
//       res.send({
//         message: "file exists",
//       })
//     } else {
//       await fs.copyFile(tempFilePath, finalFilePath);
//       await fs.unlink(tempFilePath);
//       res.send({
//         message: "file created"
//       })
//     }
//   });
// });

//====== 3 rd party apis / com between containers
//Container Network

// app.get('/people', async (req, res) => {
//   try {
//     const response = await axios.get('https://swapi.dev/api/people');
//     res.status(200).json({ people: response.data });
//   } catch (error) {
//     res.status(500).json({ message: 'Something went wrong.' });
//   }
// });

// app.get('/starships', async (req, res) => {
//   try {
//     const response = await axios.get('https://swapi.dev/api/starships');
//     res.status(200).json({ people: response.data });
//   } catch (error) {
//     res.status(500).json({ message: 'Something went wrong.' });
//   }
// });


// app.post('/favorites', async (req, res) => {
//   const favName = req.body.name;
//   const favType = req.body.type;
//   const favUrl = req.body.url;

//   try {
//     if (favType !== 'ship' && favType !== 'character') {
//       throw new Error('"type" should be "ship" or "character"!');
//     }
//     const existingFav = await Favorite.findOne({ name: favName });
//     if (existingFav) {
//       throw new Error('Favorite exists already!');
//     }
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }

//   try {
//     const favorite = await Favorite.create({
//       name: favName,
//       type: favType,
//       url: favUrl,
//     });
//     res
//       .status(201)
//       .json({ message: 'Favorite saved!', favorite: favorite.toObject() });
//   } catch (error) {
//     res.status(500).json({ message: 'Something went wrong.' });
//   }
// })

// app.get("/favourites", async (req, res) => {
//   const favorites = await Favorite.find({});
//   res.status(200).json({
//     message: "success",
//     payload: favorites
//   })
// });

//====================================================================================
//Multi container application
app.get('/goals', async (req, res) => {
  console.log('TRYING TO FETCH GOALS');
  try {
    const goals = await Goal.find();
    res.status(200).json({
      goals: goals.map((goal) => ({
        id: goal.id,
        text: goal.text,
      })),
    });
    console.log('FETCHED GOALS');
  } catch (err) {
    console.error('ERROR FETCHING GOALS');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to load goals.' });
  }
});

app.post('/goals', async (req, res) => {
  console.log('TRYING TO STORE GOAL');
  const goalText = req.body.text;

  if (!goalText || goalText.trim().length === 0) {
    console.log('INVALID INPUT - NO TEXT');
    return res.status(422).json({ message: 'Invalid goal text.' });
  }

  try {
    const goal = await Goal.create({
      text: goalText,
    });
    res
      .status(201)
      .json({ message: 'Goal saved', goal: { id: goal.id, text: goalText } });
    console.log('STORED NEW GOAL');
  } catch (err) {
    console.error('ERROR FETCHING GOALS');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to save goal.' });
  }
});


app.delete('/goals/:id', async (req, res) => {
  console.log('TRYING TO DELETE GOAL');
  try {
    await Goal.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Deleted goal!' });
    console.log('DELETED GOAL');
  } catch (err) {
    console.error('ERROR FETCHING GOALS');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to delete goal.' });
  }
});

app.get("/", (req, res) => {
  res.send("hello docker");
})

app.listen(8080, () => {
  console.log("listening 8080")
});