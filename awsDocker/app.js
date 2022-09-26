const path = require('path');

const express = require('express');

const app = express();

app.use(express.static('public'));

//hosted in s3 bucket
//http://bucket02020202.s3-website.ap-south-1.amazonaws.com/
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'views', 'welcome.html');
  res.sendFile(filePath);
});

app.listen(8080);
