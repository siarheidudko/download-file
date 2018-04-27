download = require('./index.js');

var url = "http://ftp.byfly.by/test/5mb.txt"
 
var options = {
    directory: "./test/",
    filename: "5mb.txt"
}
 
download(url, options, function(err){
	try {
		if (err) { 
			throw err;
		} else {
			console.log("okay");
		}
	} catch(e){
		console.log(e);
	}
});

var url2 = "http://ftp.byfly.by/test/error"

var options2 = {
    directory: "./test/",
    filename: "error.txt"
}

download(url2, options2, function(err){
	try {
		if (err) { 
			throw err;
		} else {
			console.log("okay");
		}
	} catch(e){
		console.log(e);
	}
});