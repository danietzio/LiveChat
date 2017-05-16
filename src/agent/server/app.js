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

app.get('/', (req, res) => {
  res.end('Hi , Your Welcome');
})

io.on('connection', function (socket) {
  console.log('a user connected');

  socket.on('disconnect', function () {
      console.log("User disconnected");
  });

  socket.on('agent message', function(val) {
      console.log('agent Message Recived : ', val.name, val.msg);

      // send msg to specific user
      io.sockets.connected[socket.id].emit('clientMessage',
          {
            'name' : 'ali',
            'msg' : 'Hi sir how are you? i have problem!',
            'date' : new Date()
          });
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
