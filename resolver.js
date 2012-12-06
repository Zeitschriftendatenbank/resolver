var SRU = require("./SRU");
var SrwAnalyzer = require("./SrwAnalyzer");
var events = require('events')
var emitter = new events.EventEmitter();

function resolve(parsedRequest, response,http) {
	
	
	function requestHoldings(parsedRequest,SrwAnalyzer){
		emitter.on('myerror', function(err) { console.log("Error:", err) });
		SRU.reqSru(parsedRequest.query["zdb"], parsedRequest.query["isil"],SrwAnalyzer,http,emitter);
	}
	
	function listHoldings(res){
		res.setEncoding('utf8');
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.on('data', function (chunk) {
			console.log('BODY: ' + chunk);
		});
		
		/*response.writeHead(200, {"Content-Type": "text/html"});
		response.write(JSON.stringify(res));
		response.end();*/		
	}
	
	requestHoldings(parsedRequest,SrwAnalyzer);
	

}

exports.resolve = resolve;