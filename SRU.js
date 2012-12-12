var SrwAnalyzer = require("./SrwAnalyzer");
function reqSru(parsedRequest,response,http,buildResolveBody){
	//find out what to search zdbid or idn
	var	sruSearchParam = (typeof parsedRequest.query["zdb"] != 'undefined') ? "zdbid%3D"+parsedRequest.query["zdb"] : "idn%3D"+parsedRequest.query["idn"];
	//console.log(sruSearchParam);
	var options = {
		hostname: 'services.d-nb.de',
		port: 80,
		path: '/sru/zdb?version=1.1&recordSchema=MABxml-1-plus&operation=searchRetrieve&query='+sruSearchParam,
		method: 'GET'
	};
	
	callback = function(res)
	{
		var srw = '';
		//another chunk of data has been recieved, so append it to `str`
		res.on('data', function (chunk) {
			srw += chunk;
		});
		// test if status code is 200
		if(res.statusCode == 200)
		{
			//the whole response has been recieved, so we give it to the analyzer
			res.on('end', function () {
				SrwAnalyzer.analyze(srw,response,parsedRequest,http,buildResolveBody);
			});
		}
		else
		{
			console.log("Error not received status code 200.\nStatus code: " + res.statuscode + "\nHEADERS: " + JSON.stringify(res.headers));
			response.statusCode = res.statusCode;
			buildResolveBody(false,false,'','',response,http);
		}
	}
	http.request(options, callback).end();
}

exports.reqSru = reqSru;