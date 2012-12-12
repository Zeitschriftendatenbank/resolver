var fs = require('fs');
function route(parsedRequest, response,resolve,http) {
	if(parsedRequest.path == "/test/"){
		//console.log(parsedRequest.path);
		fs.readFile('test/test.html', function (err, data) {
			if (err) throw err;
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write(data);
			response.end();	
		});
	}
	else{
	var errmsg = "";
	if (typeof parsedRequest.query["localUrl"] == 'undefined' || parsedRequest.query["localUrl"] == "") 
	{
		errmsg = "Unable to process request. Parameter 'localUrl' is not set. ";	
	}

	if(typeof parsedRequest.query["localSearchParam"] != 'undefined' 
		& parsedRequest.query["localSearchParam"] != 'zdb' 
		& parsedRequest.query["localSearchParam"] != 'idn' 
		& parsedRequest.query["localSearchParam"] != 'sig'
		& parsedRequest.query["localSearchParam"] != 'so')
	{
		errmsg = "Value of 'localSearchParam' can only be one of 'zdb', 'idn', 'sig' or 'so'.";
	}
	if(typeof parsedRequest.query["bib"] == 'undefined' || parsedRequest.query["bib"] == "") 
	{
		errmsg = errmsg + "Unable to process request. Parameter 'bib' is not set.";
	}

	if(typeof parsedRequest.query["zdb"] == 'undefined' || parsedRequest.query["zdb"] == "") 
	{
		
		if(typeof parsedRequest.query["idn"] == 'undefined' || parsedRequest.query["idn"] == "") 
		{
			errmsg = errmsg + "Unable to process request. Parameter 'zdb' or 'idn' is not set.";
		}
	}
	if(errmsg != ""){
		response.writeHead(400, {"Content-Type": "text/html"});
		response.write("Router says: " + http.STATUS_CODES[400] + ". " + errmsg);
		response.end();	
	} else {
		resolve(parsedRequest, response,http);
	}
	}
}

exports.route = route;