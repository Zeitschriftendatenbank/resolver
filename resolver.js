/**
 * ZDB-Linkresolver
 * Autor: Carsten Klee
 * */
var SRU = require("./SRU");

function resolve(parsedRequest, response,http) {
		
	function requestHoldings(parsedRequest,response){
		SRU.reqSru(parsedRequest,response,http,buildResolveBody);
	}
	
	buildResolveBody = function (holdings,sigSo,idn,zdbid,response,http){
		var body = "";
		var resolveUrl;
		// on error
		if(!holdings && response.statusCode != 200) {
			//console.log(response.statusCode);
			body = "Resolver says: " + http.STATUS_CODES[response.statusCode];
			doResolve(body,response);
		}
		// no holdings
		if(!holdings && response.statusCode == 200) {
			resolveUrl = "http://dispatch.opac.d-nb.de/DB=1.1/CMD?ACT=SRCHA&IKT=8506&SRT=LST_ty&TRM="+zdbid;
		}
		// found holding
		else if(typeof parsedRequest.query['localSearchParam'] == 'undefined') // default search for zdbid
		{
			resolveUrl = parsedRequest.query['localUrl'] + zdbid;
		}
		else
		{
			switch(parsedRequest.query['localSearchParam']){
				case 'sig': var arrSigSo = sigSo.split(" / "); // splits Signatur from Standort
							var sig = arrSigSo[0];
							//console.log(sig);
							resolveUrl = parsedRequest.query['localUrl'] + sig;
				break;
				case 'so': var arrSigSo = sigSo.split(" / "); // splits Signatur from Standort
							if(typeof  arrSigSo[1] != 'undefined')
							{
								var sig = arrSigSo[1];
							}
							else
							{
								var sig = arrSigSo[0]; // fallback to signatur
							}
							//console.log(sig);
							resolveUrl = parsedRequest.query['localUrl'] + sig;
				break;
				case 'idn': resolveUrl = parsedRequest.query['localUrl']  + idn;
				break;
				default: resolveUrl = parsedRequest.query['localUrl']  + zdbid;
			}
		}
		
		
		body = '<html><head><title>ZDB-Resolver</title>'+
		'<meta http-equiv="refresh" content="0; URL='+resolveUrl+'">'+
		'</head></html>';
		doResolve(body,response);
	}
	
	function doResolve(body,response){
		response.writeHead(response.statusCode, {"Content-Type": "text/html"});
		response.write(body);
		response.end();		
	}
	
	requestHoldings(parsedRequest,response);
	

}

exports.resolve = resolve;