'use strict';

var express = require('express');
var app = express.createServer();


app.get('/', (req,res, next) => {
  console.log("Request recieved");

  res.end("HAHAHAHHA");
});

app.listen(8080, () => console.log("Server Listening to port 8080"));
