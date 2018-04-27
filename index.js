/*
	download-file npm module
	original: https://www.npmjs.com/package/download-file (montanaflynn)
	released: https://github.com/siarheidudko/download-file (Siarhei Dudko admin@sergdudko.tk)
	
	Release:
		Errors removed:
			- The read stream was controlled, but it is necessary to control the write stream
		Finished:
			- Read the Content-length header (if present) and check the integrity of the stream
			- Minor code edits
			
	(c) 2018 by Siarhei Dudko.
	https://github.com/siarheidudko/iocommander/LICENSE
*/

var fs = require('fs')
var url = require('url')
var http = require('http')
var https = require('https')
var mkdirp = require('mkdirp')

module.exports = function download(file, options, callback) {
	if (!callback && typeof options === 'function') {
		callback = options;
	}
	try{
		if (!file) throw("Need a file url to download");
		options = typeof options === 'object' ? options : {};
		options.timeout = options.timeout || 20000;
		options.directory = options.directory ? options.directory : '.';
		var uri = file.split('/');
		options.filename = options.filename || uri[uri.length - 1];
		var path = options.directory + "/" + options.filename;
		if (url.parse(file).protocol === 'https:') {
			req = https;
		} else {
			req = http;
		}
		var getoptions = url.parse(file); 
		var request = req.get(getoptions, function(response) {
			if (response.statusCode === 200) {
				mkdirp(options.directory, function(err) {
					try {
						if (err) {
							throw err;
						} else {
							var filestream = fs.createWriteStream(path);
							response.pipe(filestream);
							filestream.on("finish", function(){
								if((typeof(response.headers['content-length']) !== 'undefined') && (response.headers['content-length'] !== '')){
									try {
										var stats = fs.statSync(path);
										if (stats.isFile()) {
											if(stats.size.toString() !== response.headers['content-length']){
												throw 'File not full!';
											} else {
												if (callback) callback(false, path);
											}
										} else {
											throw 'Not Found';
										}
									}catch(e){
										if (callback) callback(e.toString());
									}
								} else {
									if (callback) callback(false, path);
								} 
							});
							filestream.on("error", function(err){
								request.abort();
								if (callback) callback(err.toString());
							});
						}
					}catch(err){
						if (callback) callback(err.toString());
					}
				});
			} else{
				if (callback) callback(response.statusCode);
			}
			request.setTimeout(options.timeout, function () {
				request.abort();
				if (callback) callback("Timeout");
			});
		}).on('error', function(e) {
			if (callback) callback(e.toString());
		});
	}catch(e) {
		if (callback) callback(e.toString());
	}
}
