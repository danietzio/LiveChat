'use strict';

var http = require('http');
var express = require('express');
var app = express.createServer();
var path = require('path');
// var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, '../../../public/agent')));

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function() {

  })
});

app.listen(8080, () => console.log("Server Listening to port 8080"));
