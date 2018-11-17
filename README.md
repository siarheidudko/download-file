# Receive-file
This is the download file function for nodejs.
  
[![npm](https://img.shields.io/npm/v/receive-file.svg)](https://www.npmjs.com/package/receive-file)
[![npm](https://img.shields.io/npm/dy/receive-file.svg)](https://www.npmjs.com/package/receive-file)
[![NpmLicense](https://img.shields.io/npm/l/receive-file.svg)](https://www.npmjs.com/package/receive-file)
![GitHub last commit](https://img.shields.io/github/last-commit/siarheidudko/receive-file.svg)
![GitHub release](https://img.shields.io/github/release/siarheidudko/receive-file.svg)

The original module is available in npm (by montanaflynn): https://www.npmjs.com/package/download-file

Regarding the original module, the bug was fixed:
When the file was jumped, only the read stream from http was controlled. Because of this, when the function was completed, the file size could be 0 bytes. I control the write stream to a file and, at the moment of its completion, check the existence and size of the file.

Modified: I check the header content-length, if it is specified, then I check that the file size is equal to the sum of bytes in the header. If the amount does not converge shoot an exceptional situation.

Minor code improvements.

(c) 2018 by Siarhei Dudko.
https://github.com/siarheidudko/receive-file/LICENSE

## REQUIRES
- fs
- url
- http
- https
- mkdirp

## Install
```
npm install receive-file
```

## USAGE
```
var download = require('receive-file')
 
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
```

## API
### download(url, [options], callback(err))
- url string of the file URL to download
- options object with options
  - directory string with path to directory where to save files (default: current working directory)
  - filename string for the name of the file to be saved as (default: filename in the url)
  - timeout integer of how long in ms to wait while downloading (default: 20000)
- callback function to run after