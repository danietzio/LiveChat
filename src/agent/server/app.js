'use strict';

var express = require('express');
var app = express.createServer();
var path = require('path');
var server = app.listen(8080, () => console.log("Server Listening to port 8080"));
var io = require('socket.io')(server);


app.use(express.static(path.join(__dirname, '../../../public/agent')));

// Setting "Access-Control-Allow-Origin" to all responses
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Methods" , "PUT, GET, DELETE");
  res.setHeader("Access-Control-Allow-Origin" , "*");
  next();
});


io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function() {
      console.log("User Disconnected")
  })
});
