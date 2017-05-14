'use strict';

var express = require('express');
var app = express.createServer();
var path = require('path');
var server = app.listen(8080, () => console.log("Server Listening to port 8080"));
var io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, '../../../public/agent')));

app.use((req,res,next) => {
  console.log("afdgsgadgadkljadslhjdahk");
  next();
});

app.get('/', (req,res, next) => {
  console.log("Request recieved");

  res.end("HAHAHAHHA");
});

io.on('connection', function (socket) {
  console.log('a user connected');

  socket.on('disconnect', function () {
      console.log("User disconnected");
  });

  socket.on('client message', function(val) {
      console.log('client Message Recived : ', val.name, val.msg);

      // send msg to specific user
      io.sockets.connected[socket.id].emit('agentMessage',
          {
            'name' : 'Agent',
            'msg' : 'Hi sir how are you? how can i help you??',
            'date' : new Date()
          });
  });

});
