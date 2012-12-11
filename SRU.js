var SrwAnalyzer = require("./SrwAnalyzer");
function reqSru(parsedRequest,response,http,buildResolveUrl){
	var zdbParam = "zdbid%3D"+parsedRequest.query["zdb"];
	var options = {
		hostname: 'services.d-nb.de',
		port: 80,
		path: '/sru/zdb?version=1.1&recordSchema=MABxml-1-plus&operation=searchRetrieve&query='+zdbParam,
		method: 'GET'
	};
	
	buildUrl = function(localIdentifier,parsedRequest,response)
	{
		var resolveUrl = parsedRequest.query["local"]+localIdentifier;
	}
	
	
	callback = function(res)
	{
		// test if status code is 200
		
		var srw = '';
		//another chunk of data has been recieved, so append it to `str`
		res.on('data', function (chunk) {
			srw += chunk;
		});
		if(res.statusCode == 200)
		{
			//the whole response has been recieved, so we give it to the analyzer
			res.on('end', function () {
				SrwAnalyzer.analyze(srw,response,parsedRequest,buildResolveUrl);
			});
		}
		else
		{
			console.log("Error not received status code 200.\nStatus code: " + res.statuscode + "\nHEADERS: " + JSON.stringify(res.headers));
			response.writeHead(503, {"Content-Type": "text/html"});
			response.write("<h1>503 Service Temporarily Unavailable.</h1>");
			response.end();
		}
	}
	http.request(options, callback).end();
}

exports.reqSru = reqSru;