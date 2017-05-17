'use strict';

// data holders ( should be saved in Redis.io too!!! )
let store = {
  clients : [],
  agents : [],
  cMessages : [],
  aMessages : []
}

// server side initilization
let express = require('express');
let app = express.createServer();
let path = require('path');
let server = app.listen(8080, () => console.log("Server Listening to port 8080"));
let io = require('socket.io')(server);

// functions
// finding agent for starting chat
function initlizeAgent() {
  let min = (store.agents[0] && store.agents[0].liveCounts ) || [];
  store.agents.map((val, i) => {
    if ( val.liveCounts < min) {
      min = val;
    }
  });

  // returning agent id
  return min.Id || '';
}

// finding client supporter
function findAgent(client) {
  let agentIndex = -1;
  store.agents.map((val,i) => {
    if( val.id == client.id ) {
      agentIndex = i;
    }
  });

  return store.agents[agentIndex];
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

    // if(agentId != '') {
      // saving client in anwsering queue
      store.clients.push({
        id : socket.id,
        name : '',
        email : '',
        agentId : agentId
      });

      console.log(store);
    // } else {
    //   // saving user information for emailing anwser later
    //   // apologise from user and disconnecting the chat application
    //   //  socket.disconnect(true);
    //
    // }
  });

  // listening to new comming agents
  socket.on('agentLogin', () => {
      store.agents.push({
        id : socket.id,
        name : '',
        email : '',
        liveCounts : 0
      });

      console.log(store)
  });

  socket.on('agentMessage', function(data) {

      if(data.clientId) {
        // getting agent response to client
        const { name, msg, date } = data;
        io.sockets.connected[data.clientId]
            .emit('serverClientMessage',{name,msg,date});

      } else {
        // we can't proper client
      }

  });

  // handling comming messages from client
  socket.on('clientMessage', function(data) {

      // finding user supporter
      const agentId = store.agents[findAgent(socket)].id;

      if(findAgent(socket) != -1) {
        io.sockets.connected[agentId].emit('serverAgentMessage',{
          data,
          clientId : socket.id
        })
      } else {
        // we cant find any agent for anwsering

      }
  });
});
