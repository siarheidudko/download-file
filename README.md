# Receive-file
Download file streaming function, with content length checking (RFC2616) and support for loopback redirects.
Supports HTTP/1.1 statuses according to RFC7231, as well as status 308 (RFC7538).
  
[![npm](https://img.shields.io/npm/v/receive-file.svg)](https://www.npmjs.com/package/receive-file)
[![npm](https://img.shields.io/npm/dy/receive-file.svg)](https://www.npmjs.com/package/receive-file)
[![NpmLicense](https://img.shields.io/npm/l/receive-file.svg)](https://www.npmjs.com/package/receive-file)
![GitHub last commit](https://img.shields.io/github/last-commit/siarheidudko/receive-file.svg)
![GitHub release](https://img.shields.io/github/release/siarheidudko/receive-file.svg)

## REQUIRES
- fs
- url
- http
- https
- path

## Install
```
npm install receive-file
```

## USAGE
```
var Download = require('receive-file')
 
var url = "http://ftp.byfly.by/test/10mb.txt"
 
var options = {
    directory: "./test/",
    filename: "10mb.txt",
	timeout: 100000
}
 
Download(url, options, function(err, path){
	if(err){
		console.error(err);
	} else {
		console.log(path);
	}
});

Download(url, options).then((path) => { console.log(path); }).catch((err) => { console.error(err); });
```

## API
### download(url, [options], callback(err, path))
- url string of the file URL to download
- options object with options
  - directory string with path to directory where to save files (default: current working directory)
  - filename string for the name of the file to be saved as (default: filename in the url)
  - timeout integer of how long in ms to wait while downloading (default: 20000)
- callback function to run after. if not set, promise will be returned