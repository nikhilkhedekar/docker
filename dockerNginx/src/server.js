const express = require("express");
// const fs = require('fs').promises;//use this for fs.writeFile
const fs = require('fs');//createwritestream 
const path = require('path');
const mongoose = require("mongoose");
const morgan = require('morgan');

const Goal = require('./schema/goals');

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'access.log'),
  { flags: 'a' }
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('combined', { stream: accessLogStream }));

//mongo atlas
// mongoose.connect("mongodb+srv://Dhungel:Dhungel@awsdhungel.oevqe.mongodb.net/AWSDhungel?retryWrites=true&w=majority");

//you can use ip address too see section 73
// mongoose.connect("mongodb://127.0.0.1:27017/swapiFav?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4");
//running all server on one network
//--network mongo_nw
//--name mongo_first_nw = mongo%5Ffirst%5Fnw 
mongoose.connect("mongodb://mongo%5Ffirst%5Fnw:27017/swapiFav?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4");

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