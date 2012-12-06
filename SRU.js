function reqSru(zdb,isil,SrwAnalyzer,http){
	//http://services.d-nb.de/sru/zdb?version=1.1&operation=searchRetrieve&query=isil%3DDE-1a+zdbid%3D2019300-2&recordSchema=MABxml-1-plus
	var baseUrl = "http://services.d-nb.de/sru/zdb?version=1.1&recordSchema=MABxml-1-plus&operation=searchRetrieve&query=";
	var zdbParam = "zdbid%3D"+zdb;
	var isilParam = "isil%3D"+isil;
	var sruUrl = baseUrl+zdbParam+"+"+isilParam;
	var options = {
		hostname: 'services.d-nb.de',
		port: 80,
		path: '/sru/zdb?version=1.1&recordSchema=MABxml-1-plus&operation=searchRetrieve&query='+zdbParam+'+'+isilParam,
		method: 'GET'
	};
	
	callback = function(response) {
		var srw = '';
		
		//another chunk of data has been recieved, so append it to `str`
		response.on('data', function (chunk) {
			srw += chunk;
		});
		
		//the whole response has been recieved, so we give it to the analyzer
		response.on('end', function () {
			SrwAnalyzer.analyze(isil,srw);
		});
	}

	http.request(options, callback).end();
}

exports.reqSru = reqSru;