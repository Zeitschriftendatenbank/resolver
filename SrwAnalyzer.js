// needs xml2js to be installed
var xml2js = require('xml2js');
// needs JSONPath to be installed
var jsonpath = require('JSONPath').eval;
// needs eyes to be installed
//var inspect = require('eyes').inspector({maxLength: false})
function analyze(srw,response,parsedRequest,buildResolveUrl){

	try{
		var parser = new xml2js.Parser();
		parser.parseString(srw, 
			function (err, result) {
				//console.dir(result);
				//console.dir(result.diagnostics);
				if(typeof result.diagnostics != "undefined")  throw new Error("SRU Error");
				var sRR = result.searchRetrieveResponse;
				var numberOfRecords = sRR.numberOfRecords[0];
				
				//console.dir(sRR.records);
				var datensatz = sRR.records[0].record[0].recordData[0].datensatz[0];
				//console.dir(records[0]);
				
				var allFields = jsonpath(datensatz, "$.feld[?(@.nr='077')]");
				//inspect(jsonpath(datensatz, "$.feld[?(@.nr='077')]"));
				// first find Sigel
				var sigSo = false;
				
				fieldLoop: for(var u in allFields) {
					// all subfileds uf
					//var uf = jsonpath(allFields[u], "$.uf[?(@.code='v')]");
					var uf = jsonpath(allFields[u], "$.uf");
					if(uf[0])
					{
						//console.log(uf[0]);
						for(var x in uf[0])
						{
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
				}

				// callback
				buildResolveUrl(sigSo);
			}
		);
	} catch(e){
		console.log("xml2js says Error: " + e.message);
		response.writeHead(500, {"Content-Type": "text/html"});
		response.write("xml2js says Error: " + e.message);
		response.end();
	}

	
}

exports.analyze = analyze;