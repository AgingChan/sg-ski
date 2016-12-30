/**
 * Singpore Skiing
 * @authors Aging Chan (aging.chan@gmail.com)
 * @date    2016-12-30 09:51:05
 * @version $Id$
 */

var fs = require('fs'),
	semver = require('semver'),
	readline = require('readline');
// Check the Node version

const RETURN_ERR = {
	SUCCESS: 0,
	ERR_INVALID_ARGUMENTS: 1,
	ERR_ILLEGAL_MAP: 2,
}



if(semver.lt(process.version,'6.0.0')){
	console.log('Node version mismatch');
	process.exit(1);
}

var filePath = '';

// Parameter Handling
if(process.argv.length > 3){
	console.log("Unexpected arguments");
	console.log("Please try this 'node sg-ski.js [map file]'");
	process.exit(RETURN_ERR.ERR_INVALID_ARGUMENTS);
}
else if(process.argv.length === 3){
	filePath = process.argv[2];
}
else{
	filePath = "./test1.txt" 
}

console.log('Map File: ' + filePath);

function SG_SKI_RESOUT(mapFilePath){
	let that = this;
	this.mapArray = new Array(0);
	this.mapFilePath = mapFilePath;
	this.rowNum = 0;
	this.colNum = 0;

	this.bestPath = {
		"srcArea": {
			"row":0,
			"col":0,
		},
		"dstArea": {
			"row": 0,
			"col": 0,
		},
		"pathLength": 0,
	};

	this.mapReadlineInterface = readline.createInterface({
		input: fs.createReadStream(that.mapFilePath)
	})

	this.mapReadlineInterface.on('line', (line) => {
		arguments.callee.line = ++arguments.callee.line || 0;
		if(arguments.callee.line == 0){
			// The first line which stores the dimension
			var dimension = line.split(' ');
			this.rowNum = dimension[0];
			this.colNum = dimension[1];
			console.log('Row: ' + this.rowNum + '; Col: ' + this.colNum);
		}
		else{
			var numBufferString = line.split(' ');
			if(numBufferString.length != this.colNum){
				console.log('Illegal Ski Resort Map. Please double check the map file');
				process.exit(RETURN_ERR.ERR_ILLEGAL_MAP);
			}

			this.mapArray.push(numBufferString);
		}
	})

	this.mapReadlineInterface.on('close', () => {
		if(this.mapArray.length != this.rowNum){
			console.log('Illegal Ski Resort Map. Please double check the map file');
			process.exit(RETURN_ERR.ERR_ILLEGAL_MAP);
		}
		else{
			console.log('End of file and row num is correct');
			this.getMapBestPath();
		}
	})
}

SG_SKI_RESOUT.prototype.isPeakArea = function(row, col) {
	// body...
};


SG_SKI_RESOUT.prototype.isBottomArea = function(row, col) {
	// body...
};


SG_SKI_RESOUT.prototype.getMapBestPath = function() {
	// body...
	console.log('To get the best path of the resort');
	console.log(this.mapArray);
};


var resort = new SG_SKI_RESOUT(filePath);
