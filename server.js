var http = require("http");
var url = require("url");

function start(route,resolve) {
  function onRequest(request, response) {
    
	var parsedRequest = url.parse(request.url,true);
	
	console.log("Request for  %j", parsedRequest);
 
	route(parsedRequest, response,resolve,http);
  }

  http.createServer(onRequest).listen(8888);
  console.log("Server has started.");
}

exports.start = start;