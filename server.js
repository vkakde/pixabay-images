///\author Kakde, Vishwajeet
///\desc Node app to demonstrate understanding of web sockets
///\remark This task took about 6 hours of through development, testing and debugging
///\cite https://www.youtube.com/watch?v=tHbCkikFfDE

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var axios = require('axios');
const redisConnection = require("./redis-connection");
const bodyParser = require("body-parser");
connections = [];

server.listen(3000);
console.log('Server has been started on port 3000...');

io.sockets.on('connection', function (socket) {
  connections.push(socket);
  console.log('Connected: %s sockets connected', connections.length);

  // Disconnect
  socket.on('disconnect', function (data) {
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnection: %s of sockets connected', connections.length);
  });

  // Recieve client search request
  socket.on('send message', async function (data) {
    console.log("\nServer recieved request through websocket to search for: " + data.searchQuery);

    // invoke worker to search on Pixabay using API call
    ///\remark Worker only gets the search-query. It has no use for username and message. 
    var searchResult = await redisConnection.emit(
      "search",
      { "searchQuery": data.searchQuery, "userName": data.userName, "message": data.message }
    );

    // Wait for and catch search response result from worker
    redisConnection.on("searchResponse", function(data, channel) {
      if(data.status!=200){
        console.log("\n[Server] Something went wrong with the search (as reported by worker). Status from pixabay: "+data.status);
      }
      else{
        // Send the data via web-sockets to all connected clients
        io.sockets.emit('new message', data);

        // console.log("[Server] Search results returned: %O", data.data);
      }
    });
  })
});

app.get('/', async function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
