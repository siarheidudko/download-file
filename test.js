/**
 *	download-file npm module
 *	original: https://www.npmjs.com/package/download-file (montanaflynn)
 *	released: https://github.com/siarheidudko/download-file (Siarhei Dudko admin@sergdudko.tk)
 *	
 *	Release:
 *		Errors removed:
 *			- The read stream was controlled, but it is necessary to control the write stream
 *		Finished:
 *			- Read the Content-length header (if present) and check the integrity of the stream
 *			- Minor code edits
 *			
 *	(c) 2018 by Siarhei Dudko.
 *	https://github.com/siarheidudko/iocommander/LICENSE
 */

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