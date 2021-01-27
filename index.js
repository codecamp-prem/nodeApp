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

    // choose the handler this request should go to. if not default handler notFound
    var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // construct the data object to send to the handler
    var data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method' : method,
      'headers': headers,
      'payload': buffer
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, function(statusCode, payload){
      // Use the status code  call backed from handler, default statusCode: 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      // Use  the payload call backed from handler, default payload: {}
      payload = typeof(payload) == 'object' ? payload : {};

      // Convert payload to string
      var payloadString = JSON.stringify(payload);

      // return the response
      res.setHeader('Content-Type','application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
      // log the request path
      console.log('Returning this response: ',statusCode, payloadString);
    });

  });
});
// Start the server, and have it listen on port 3000
server.listen(3000, function(){
  console.log("listening in port: 3000");
});

// define the handlers
var handlers = {};

// Sample Handler
handlers.sample = function(data,callback){
  // Callback a http status code, and a payload object
  callback(406, {'name':'Sample Handler'});
};

// define a not found handlers
handlers.notFound = function(data, callback){
  callback(404);
};

// define the request router
var router = {
  'sample':handlers.sample,
};
