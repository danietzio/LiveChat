'use strict';

// data holders ( should be saved in Redis.io too!!! )

var store = {
  clients: [],
  agents: [],
  cMessages: [],
  aMessages: []
};

// server side initilization
var express = require('express');
var app = express.createServer();
var path = require('path');
var server = app.listen(8080, function () {
  return console.log("Server Listening to port 8080");
});
var io = require('socket.io')(server);

// functions
// finding agent for starting chat
function initlizeAgent() {
  if (store.agents.length == 1) {
    var counts = store.agents[0].liveCounts;
    var min = store.agents[0];

    store.agents.map(function (val) {
      if (val.liveCounts < counts) {
        min = val;
      }
    });

    // returning agent id
    return min.id;
  } else {
    return '';
  }
}

// finding client supporter
function findAgent(client) {
  // finding client Index in store
  var clientIndex = findClient(client);
  var agentIndex = -1;

  store.agents.map(function (val, i) {
    if (val.id == store.clients[clientIndex].agentId) {
      agentIndex = i;
    }
  });

  return store.agents[agentIndex];
}

// finding client Index
function findClient(client) {
  var clientIndex = -1;
  store.clients.map(function (val, i) {
    if (val.id == client.id) {
      clientIndex = i;
    }
  });

  return clientIndex;
}

app.use(express.static(path.join(__dirname, '../../../public/agent')));

// Setting "Access-Control-Allow-Origin" to all responses
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Methods", "PUT, GET, DELETE");
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get('/', function (req, res) {
  res.end('Hi , Your Welcome');
});

io.on('connection', function (socket) {
  console.log('a user connected');

  socket.on('disconnect', function () {
    console.log("User disconnected");
  });

  // listening to new comming users
  socket.on('clientLogin', function () {
    // finding best agent for anwsering
    var agentId = initlizeAgent();

    if (agentId != '') {
      // saving client in anwsering queue
      store.clients.push({
        id: socket.id,
        name: '',
        email: '',
        agentId: agentId
      });

      console.log("we have agent id", store.clients);
    } else {
      console.log("we dont have agent id", store.clients);

      // saving user information for emailing anwser later
      // apologise from user and disconnecting the chat application
      var timer = setInterval(function () {
        if (initlizeAgent() != '') {
          var _agentId = initlizeAgent();

          // saving client in anwsering queue
          store.clients.push({
            id: socket.id,
            name: '',
            email: '',
            agentId: _agentId
          });

          // clearing the interval
          clearInterval(timer);
        }
      }, 2000);
    }
  });

  // listening to new comming agents
  socket.on('agentLogin', function () {
    store.agents.push({
      id: socket.id,
      name: '',
      email: '',
      liveCounts: 0
    });
  });

  socket.on('agentMessage', function (data) {

    if (data.clientId) {
      // getting agent response to client
      var name = data.name,
          msg = data.msg,
          date = data.date;

      io.sockets.connected[data.clientId].emit('serverAgentMessage', { name: name, msg: msg, date: date });
    } else {
      // we can't proper client
    }
  });

  // handling comming messages from client
  socket.on('clientMessage', function (data) {
    // finding user supporter
    var agentId = findAgent(socket).id;
    var name = data.name,
        msg = data.msg,
        date = data.date;


    if (agentId) {
      io.sockets.connected[agentId].emit('serverClientMessage', {
        name: name,
        msg: msg,
        date: date,
        clientId: socket.id
      });
    } else {
      console.log("Agents aren't online, wait plz!!");
    }
  });
});