function route(parsedRequest, response,resolve,http) {
  var errmsg = "";
  if (parsedRequest.query["local"] == undefined || parsedRequest.query["local"] == "") 
  {
	errmsg = "Unable to process request. Parameter 'local' is not set. ";	
  }
  if(parsedRequest.query["isil"] == undefined || parsedRequest.query["isil"] == "") 
  {
    errmsg = errmsg + "Unable to process request. Parameter 'isil' is not set.";
  }
  if(parsedRequest.query["zdb"] == undefined || parsedRequest.query["zdb"] == "") 
  {
    errmsg = errmsg + "Unable to process request. Parameter 'zdb' is not set.";
  }
  if(errmsg != ""){
	  response.writeHead(404, {"Content-Type": "text/html"});
	  response.write(errmsg);
	  response.end();	
  } else {
	resolve(parsedRequest, response,http);
  }
}

exports.route = route;