/**
 * Module for download file (use stream methods)
 * @module receive-file
 * @author Siarhei Dudko <slavianich@gmail.com>
 * @copyright 2019-2020
 * @license MIT
 * @version 2.0.0
 * @requires fs
 * @requires url
 * @requires http
 * @requires https
 * @requires path
 */

'use strict'

let Fs = require('fs'),
	Url = require('url'),
	Http = require('http'),
	Https = require('https'),
	Path = require('path');

/**
  * File delete function
  * 
  * @private
  * @async
  * @function
  * @param {string} file - path to delete file
  * @param {Error} msg - Error instance to send to the callback function
  * @param {DeleteFileCallback} callback
  */
let deleteFile = function(file, msg, callback){
	Fs.unlink(file, () => {
		callback(msg);
	});
}
/**
  * File download promise
  * 
  * @private
  * @async
  * @function
  * @param {string} url - file download link
  * @param {ReceiveFileSettings} options - download settings object
  * @param {number} level - iteration number, to avoid cyclic redirect
  * @return {Promise<string>} path - path where the file was downloaded
  */
let receivefile = function(url, options, level = 0){
	let dt = Date.now();
	return new Promise((res, rej) => {
		let path = Path.join(options.directory, options.filename);
		let Req;
		let Options = Url.parse(url);
		if (Options.protocol === 'https:') {
			Req = Https;
		} else {
			Req = Http;
		}
		let request = Req.request(Options,(response) => {
			switch(response.statusCode){
				case 200:
				case 201:
				case 202:
				case 203:
				case 204:
				case 205:
					Fs.promises.mkdir(options.directory, {recursive: true, mode: 0o666}).then(() => {
						let filestream = Fs.createWriteStream(path);
						let _timer = options.timeout + dt;
						response.on('data', () => {
							if((_timer - Date.now()) < 0) { request.abort(); }
						}).pipe(filestream);
						filestream.on("finish",() => {
							if((typeof(response.headers['content-length']) === 'string') && (response.headers['content-length'] !== '')){
								try {
									var stats = Fs.statSync(path);
									if (stats.isFile()) {
										if(stats.size.toString() !== response.headers['content-length']){
											deleteFile(path, new Error('File not full!'), rej);
										} else {
											res(path);
										}
									} else {
										deleteFile(path, new Error('Not Found'), rej);
									}
								} catch(err){
									deleteFile(path, err, rej);
								}
							} else {
								res(path);
							} 
						});
						filestream.on("error",(err) => {
							deleteFile(path, err, rej);
						});
						response.on('aborted', () => {
							response.unpipe(filestream);
							response.destroy();
							filestream.destroy(new Error('Request aborted!'));
						});
					}).catch(rej);
					break;
				case 300:
				case 301:
				case 302:
				case 303:
				case 304:
				case 305:
				case 306:
				case 307:
				case 308:
					if((typeof(response.headers['location']) === 'string') && (level < 3)){
						receivefile(response.headers['location'], options, ++level).then(res).catch(rej);
					} else {
						rej(new Error(response.statusCode + ' - ' + response.statusMessage));
					}
					break;
				default:
					rej(new Error(response.statusCode + ' - ' + response.statusMessage));
					break;
			}
		}).on('timeout', () => {
			request.abort();
		}).on('error', (err) => {
			rej(err);
		});
		let timeout = options.timeout - (Date.now() - dt );
		if(timeout > 0){
			request.setTimeout(timeout);
			request.end();
		} else {
			request.abort();
			rej(new Error('Request aborted with timeout!'));
		}
	});
}

/**
  * File download function
  * 
  * @async
  * @function
  * @param {string} url - file download link
  * @param {ReceiveFileSettings} options - download settings object
  * @param {ReceiveFileCallback} callback - if not set, promise will be returned
  * @return {Promise<string>} path - path where the file was downloaded
  */
let ReceiveFile = function(url, options, callback){
	if ((typeof(callback) !== 'function') && (typeof(options) === 'function')) {
		callback = options;
	}
	if(typeof(options) !== 'object'){
		options = {};
	}
	if(!Number.isInteger(options.timeout)){
		options.timeout = 30000;
	}
	if(typeof(options.directory) !== 'string'){
		options.directory = Path.normalize('.');
	} else {
		options.directory = Path.normalize(options.directory);
	}
	if(typeof(options.filename) !== 'string'){
		let arr = url.split('/');
		options.filename = arr[arr.length - 1];
	}
	if(typeof(url) !== 'string'){
		if(typeof(callback) !== 'function') {
			return Promise.reject(new Error("Need a file url to download"));
		} else {
			callback(new Error("Need a file url to download"));
			return;
		}
	} else if(typeof(callback) !== 'function') {
		return receivefile(url, options, 0); 
	} else {
		receivefile(url, options, 0).then((_path) => { callback(undefined, _path); }).catch((err) => { callback(err); });
		return;
	}
};

/**
 * ReceiveFile Callback Function, if not set, promise will be returned
 *
 * @callback ReceiveFileCallback
 * @param {Error} err - if the request completed with an error, or undefined
 * @param {string} path - if the request is successful, or undefined
 */
 
 /**
 * ReceiveFile Object Settings
 *
 * @namespace ReceiveFileSettings
 * @property {string} directory - directory for download file
 * @property {string} filename - filename for download file
 * @property {number} timeout - download file timeout, milliseconds
 */
 
 /**
 * Delete File Callback Function
 *
 * @private
 * @callback DeleteFileCallback
 * @param {Error} err - instance of Error
 */

module.exports = ReceiveFile;