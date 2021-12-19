const express = require('express'),
app = express();
let mongoose = require("mongoose");

app.use(express.urlencoded({extended: false}));
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/imgshare", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(res => {
  console.log("Database connected.");

}).catch(err => { 
  console.log(err); 

});

app.get("/", (req, res) => {
  res.json({});
});

module.exports = app;