// needs xml2js to be installed
// needs JSONPath to be installed
var xmlToJson = require("./xmlToJson");
var xml2js = require('xml2js');
var jsonpath = require('JSONPath').eval;
//jsonpath(obj, path);
function analyze(isil,srw){

	try{
		var parser = new xml2js.Parser();
		parser.parseString(srw, function (err, result) {
			console.dir(result);
			var sRR = result.searchRetrieveResponse;
			var numberOfRecords = sRR.numberOfRecords[0];
			
			console.dir(sRR.records);
			var records = sRR.records;
			//console.dir(records[0]);
			
			console.dir(jsonpath(records[0], "$.record.*"));
			/*
			for(var i=0;i<numberOfRecords;i++){
				var datensatz = records[i].record[0].recordData[0].datensatz;
				console.dir(datensatz[0].feld);
				//var fields = datensatz.selectElementsByName("feld");
				
			}
			*/
			
		});
	} catch(e){
		console.log("xml2js-Error: " + e.message);
	}

	
}

exports.analyze = analyze;