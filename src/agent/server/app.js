'use strict';

// data holders ( should be saved in Redis.io too!!! )
const store = {
  clients : [],
  agents : [],
  cMessages : [],
  aMessages : []
}

// server side initilization
const express = require('express');
const app = express.createServer();
const path = require('path');
const server = app.listen(8080, () => console.log("Server Listening to port 8080"));
const io = require('socket.io')(server);

// functions
// finding agent for starting chat
function initlizeAgent() {
  if ( store.agents.length == 1 ) {
    const counts = store.agents[0].liveCounts;
    let min = store.agents[0];

    store.agents.map((val) => {
      if ( val.liveCounts < counts) {
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
  const clientIndex = findClient(client);
  let agentIndex = -1;

  store.agents.map((val,i) => {
    if( val.id == ( store.clients[clientIndex] && store.clients[clientIndex].agentId ) ) {
      agentIndex = i;
    }
  });

  return store.agents[agentIndex];
}

// finding client Index
function findClient(client) {
  let clientIndex = -1;
  store.clients.map((val,i) => {
    if(val.id == client.id) {
      clientIndex = i;
    }
  });

  return clientIndex;
}

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

  // listening to new comming users
  socket.on('clientLogin', () => {
    // finding best agent for anwsering
    const agentId = initlizeAgent();

    if(agentId != '') {
      // saving client in anwsering queue
      store.clients.push({
        id : socket.id,
        name : '',
        email : '',
        agentId : agentId
      });

      console.log("we have agent id", store.clients);

    } else {
      console.log("we dont have agent id", store.clients);

      // saving user information for emailing anwser later
      // apologise from user and disconnecting the chat application
      const timer = setInterval(() => {
        if(initlizeAgent() != '') {
          const agentId = initlizeAgent();

          // saving client in anwsering queue
          store.clients.push({
            id : socket.id,
            name : '',
            email : '',
            agentId : agentId
          });

          // clearing the interval
          clearInterval(timer);
        }
      }, 2000);
    }
  });

  // listening to new comming agents
  socket.on('agentLogin', () => {
      store.agents.push({
        id : socket.id,
        name : '',
        email : '',
        liveCounts : 0
      });

  });

  socket.on('agentMessage', function(data) {

      if(data.clientId) {
        // getting agent response to client
        const { name, msg, date } = data;
        io.sockets.connected[data.clientId]
            .emit('serverAgentMessage',{name,msg,date});

      } else {
        // we can't proper client
      }

  });

  // handling comming messages from client
  socket.on('clientMessage', function(data) {
      // finding user supporter
      const agentId = findAgent(socket) && findAgent(socket).id
      const { name, msg, date } = data;

      if(agentId && io.sockets.connected[agentId]) {
        io.sockets.connected[agentId].emit('serverClientMessage',{
          name,
          msg,
          date,
          clientId : socket.id
        })
      } else {
        console.log("Agents aren't online, wait plz!!");
      }
  });
});
