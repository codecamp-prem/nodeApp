/*
* Primary file for API
*
*/

// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

// The server should respond to all requests with the string
var server = http.createServer(function(req, res){
  // GEt the url and parse it
  var parsedUrl = url.parse(req.url, true);

  // get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g,'');

  // Get the Query string
  var queryStringObject = parsedUrl.query;

  // Get the HTTP method
  var method = req.method.toLowerCase();

  // Get the headers as objects
  var headers = req.headers;

  // Get the payload, if any
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', function(data){
    buffer += decoder.write(data);
  });
  req.on('end', function(){
    buffer += decoder.end();
    // Send the response
    res.end("Wolrd");
    // log the request path
    console.log('Request Recieved with this payload: ',buffer);
  });
});
// Start the server, and have it listen on port 3000
server.listen(3000, function(){
  console.log("listening in port: 3000");
});
