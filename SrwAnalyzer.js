/**
 * ZDB-Linkresolver
 * Autor: Carsten Klee
 * */
// needs xml2js to be installed
var xml2js = require('xml2js');
// needs JSONPath to be installed
var jsonpath = require('JSONPath').eval;
// needs eyes to be installed
var inspect = require('eyes').inspector({maxLength: false})
function analyze(srw,response,parsedRequest,http,buildResolveBody){

	try{
		var parser = new xml2js.Parser();
		parser.parseString(srw, 
			function (err, result) {
				//console.dir(result);
				//console.dir(result.diagnostics);
				if(typeof result.diagnostics != "undefined") 
				{
					e = new Error(http.STATUS_CODES[422]);
					e.statusCode = 422;
					throw e;
				}
				var sRR = result.searchRetrieveResponse;
				var numberOfRecords = sRR.numberOfRecords[0];
				var sigSo = false;
				var holdings = false;
				var statusCode;
				//console.log("NumberofRecords: " + numberOfRecords);
				// only when found something
				if(numberOfRecords == 0) 
				{
					e = new Error(http.STATUS_CODES[404]);
					e.statusCode = 404;
					throw e;
				}

				//console.dir(sRR.records);
				var datensatz = sRR.records[0].record[0].recordData[0].datensatz[0];
				//console.dir(jsonpath(datensatz, '$.feld[*[?(@.nr=="077")]]'));
				//inspect(datensatz);
				
				// get idn and zdbid
				var idn, zdbid;
				var allFields = jsonpath(datensatz, '$.feld');
				firstLoop: for(var f in allFields[0]){
					
					if(allFields[0][f].$.nr == "025" && allFields[0][f].$.ind == 'a') idn = allFields[0][f]._;
					if(allFields[0][f].$.nr == "025" && allFields[0][f].$.ind == 'z') zdbid = allFields[0][f]._;
					//console.log("ZDBID: " + zdbid + " IDN: " + idn);
					if(idn != null && zdbid != null) break firstLoop;
				}
				
				fieldLoop: for(var u in allFields)
				{
					//inspect(allFields[u]);
					// all subfileds uf
					var uf = jsonpath(allFields[u], "$..uf");
					if(uf[0] != "undefined")
					{
						//console.log("uf[0]: " + uf[0]);
						for(var x in uf)
						{
							for(var i in uf[x])
							{
								//console.log(uf[x][i]._);
								if(uf[x][i].$.code == 'd') sigSo = uf[x][i]._;
								if(uf[x][i]._ == "<"+parsedRequest.query['bib']+">" && uf[x][i].$.code == 'v') // Sigel is found
								{
									//console.log("Sigel: "+ uf[x][i]._);
									//console.log("Signatur: "+ sigSo);
									holdings = true;
									break fieldLoop;
								}
							}
							// every loop has a fresh sigSo
							sigSo = false;
						}
					}
					else 
					{
						e = new Error(http.STATUS_CODES[500]);
						e.statusCode = 500;
						throw e;
					}
				}

				// callback
				buildResolveBody(holdings,sigSo,idn,zdbid,response,http);
			}
		);
	} catch(e){
		console.log("xml2js says Error: " + e.message);
		response.writeHead(e.statusCode, {"Content-Type": "text/html"});
		response.write("Analyzer says: " + e.message);
		response.end();
	}

	
}

exports.analyze = analyze;