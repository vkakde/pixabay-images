const redisConnection = require("./redis-connection");
const axios = require("axios");
const bluebird = require('bluebird');
const redis = bluebird.Promise.promisifyAll(require('redis'));

let computedResults = null;

// Create Redis Client
let client = redis.createClient();

client.on('connect', async function () {
  console.log('Ready on port 3000 localhost \n');
});

// handle search request 
redisConnection.on("search", async function (data, channel) {
  // console.log("Worker recieved GET request for search query " + data.searchQuery);

  // perform API call to pixabay to search for query
  axios({
    url: 'https://pixabay.com/api/',
    method: 'get',
    params: {
      key: "8604717-7f5d8727a017a80e352eef498",
      q: data.searchQuery
    }
  }).then((searchResults) => {
    // Viewing complex json objects in console (workaround for object Object console logs)
    ///\cite https://stackoverflow.com/a/32238006
    //console.log('\nAPI search response: %O',searchResults);

    // console.log('\n[Worker] Search returned total hits: ',searchResults.data.totalHits);

    // send search results back to server/master
    redisConnection.emit(
      "searchResponse",
      { "data": searchResults.data, "userName": data.userName, "message": data.message, "status": searchResults.status}
    );
  })
});