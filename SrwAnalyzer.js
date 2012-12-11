// needs xml2js to be installed
var xml2js = require('xml2js');
// needs JSONPath to be installed
var jsonpath = require('JSONPath').eval;
// needs eyes to be installed
var inspect = require('eyes').inspector({maxLength: false})
function analyze(srw,response,parsedRequest,buildResolveUrl){

	try{
		var parser = new xml2js.Parser();
		parser.parseString(srw, 
			function (err, result) {
				//console.dir(result);
				//console.dir(result.diagnostics);
				if(typeof result.diagnostics != "undefined") 
				{
					e = new Error("<h1>500 Internal Server Error</h1>Unerwarter SRU-Fehler");
					e.statusCode = 500;
					throw e;
				}
				var sRR = result.searchRetrieveResponse;
				var numberOfRecords = sRR.numberOfRecords[0];
				var sigSo = false;
				var statusCode;
				//console.log("NumberofRecords: " + numberOfRecords);
				// only when found something
				if(numberOfRecords == 0)
				{
						e = new Error("<h1>404 Not Found</h1>Die ID " + parsedRequest.query['zdb'] + " konnte nicht gefunden werden.");
						e.statusCode = 404;
						throw e;
				}

				//console.dir(sRR.records);
				var datensatz = sRR.records[0].record[0].recordData[0].datensatz[0];
				//console.dir(records[0]);
				
				var allFields = jsonpath(datensatz, "$.feld[?(@.nr='077')]");
				//inspect(jsonpath(datensatz, "$.feld[?(@.nr='077')]"));
				// first find Sigel	
				fieldLoop: for(var u in allFields)
				{
					// all subfileds uf
					//var uf = jsonpath(allFields[u], "$.uf[?(@.code='v')]");
					var uf = jsonpath(allFields[u], "$.uf");
					inspect(uf);
					if(uf[0] != "undefined")
					{
						//console.log("uf[0]: " + uf[0]);
						for(var x in uf[0])
						{
							//console.log(uf[0][x]._);
							if(uf[0][x]._ == "<"+parsedRequest.query['bib']+">") // Sigel is found
							{
								//console.log("Sigel: "+ uf[0][x]._);
								//console.log(uf[x].$.code);
								for(var i in uf[0]){
									if(uf[0][i].$.code == 'd') // find Signatur/Standort
									{
										//console.log(uf[0][i].$.code);
										sigSo =  uf[0][i]._;
										break fieldLoop;
									}
								}
								break fieldLoop;
							}
						}
					}
					else 
					{
						e = new Error("<h1>500 Internal Server Error</h1>Unerwarter SRU-Fehler");
						e.statusCode = 500;
						throw e;
					}
				}

				// callback
				buildResolveUrl(sigSo);
			}
		);
	} catch(e){
		//console.log("xml2js says Error: " + e.message);
		response.writeHead(e.statusCode, {"Content-Type": "text/html"});
		response.write("Analyzer: " + e.message);
		response.end();
	}

	
}

exports.analyze = analyze;