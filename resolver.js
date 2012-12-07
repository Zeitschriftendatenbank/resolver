var SRU = require("./SRU");
var events = require('events')
//var emitter = new events.EventEmitter();

function resolve(parsedRequest, response,http) {
		
	function requestHoldings(parsedRequest,response){
		//emitter.on('myerror', function(err) { console.log("Error:", err) });
		SRU.reqSru(parsedRequest,response,http,buildResolveUrl);
	}
	
	buildResolveUrl = function (sigSo){
		if(!sigSo) {
			doResolve("http://dispatch.opac.d-nb.de/DB=1.1/CMD?ACT=SRCHA&IKT=8506&SRT=LST_ty&TRM="+parsedRequest.query['zdb']);
		} else {
			var arrSigSo = sigSo.split(" / "); // splits Signatur from Standort
			var sig = arrSigSo[0];
			//console.log(sig);
			var resolveUrl = parsedRequest.query['local'] + sig;
			doResolve(resolveUrl);			
		}
	}
	
	function doResolve(resolveUrl){
		var body = '<html><head><title>ZDB-Resolver</title>'+
		'<meta http-equiv="refresh" content="0; URL='+resolveUrl+'">'+
		'</head><body>'+resolveUrl+'</body></html>';
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write(body);
		response.end();		
	}
	
	requestHoldings(parsedRequest,response);
	

}

exports.resolve = resolve;