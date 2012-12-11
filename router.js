function route(parsedRequest, response,resolve,http) {
  var errmsg = "";
  if (typeof parsedRequest.query["local"] == 'undefined' || parsedRequest.query["localUrl"] == "") 
  {
	errmsg = "Unable to process request. Parameter 'localUrl' is not set. ";	
  }
  if(typeof parsedRequest.query["bib"] == 'undefined' || parsedRequest.query["bib"] == "") 
  {
    errmsg = errmsg + "Unable to process request. Parameter 'bib' is not set.";
  }
  
  if(typeof parsedRequest.query["zdb"] == 'undefined' || parsedRequest.query["zdb"] == "") 
  {
    errmsg = errmsg + "Unable to process request. Parameter 'zdb' is not set.";
  }
  if(errmsg != ""){
	  response.writeHead(400, {"Content-Type": "text/html"});
	  response.write("Router says: " + http.STATUS_CODES[400] + ". " + errmsg);
	  response.end();	
  } else {
	resolve(parsedRequest, response,http);
  }
}

exports.route = route;