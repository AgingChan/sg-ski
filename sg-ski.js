/**
 * Singpore Skiing
 * @authors Aging Chan (aging.chan@gmail.com)
 * @date    2016-12-30 09:51:05
 * @version $Id$
 */

const fs = require('fs'),
	semver = require('semver'),
	readline = require('readline'),
	ev = require('events');
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

class SG_SKI_RESOUT extends ev{
	constructor(mapFilePath){
		super();
		let that = this;

		this.mapArray = new Array(0);
		this.bestPathArray = new Array(0);
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
			this.emit('mapRead', line)
		})

		this.mapReadlineInterface.on('close', () => {
			this.emit('init');
		})
	}
}


SG_SKI_RESOUT.prototype.isPeakArea = function(row, col) {
	// body...
	if(row && this.mapArray[row-1][col] > this.mapArray[row][col]){
		return false;
	}
	else if( (row < this.rowNum-1) && (this.mapArray[row+1][col] > this.mapArray[row][col]) ){
		return false;
	}
	else if( col && this.mapArray[row][col-1] > this.mapArray[row][col]){
		return false;
	}
	else if( (col<this.colNum-1) && (this.mapArray[row][col+1] > this.mapArray[row][col]) ){
		return false;
	}
	else{
		//console.log("New Peak found, whose row is: " + row + " and column is " + col);
		return true;
	}
};


SG_SKI_RESOUT.prototype.isBottomArea = function(row, col) {
	// body...
	if(row && this.mapArray[row-1][col] < this.mapArray[row][col]){
		return false;
	}
	else if( (row < this.rowNum-1) && (this.mapArray[row+1][col] < this.mapArray[row][col]) ){
		return false;
	}
	else if( col && this.mapArray[row][col-1] < this.mapArray[row][col]){
		return false;
	}
	else if( (col<this.colNum-1) && (this.mapArray[row][col+1] < this.mapArray[row][col]) ){
		return false;
	}
	else{
		//console.log("New Bottom found, whose row is: " + row + " and column is " + col);
		return true;
	}
};


SG_SKI_RESOUT.prototype.getMapBestPath = function() {
	// body...
	console.log('To get the best path of the resort');
	console.log(this.mapArray);

	for(var row=0; row < this.rowNum; row++){
		for(var col=0; col<this.colNum; col++){
			//this.isBottomArea(row,col);
			//this.isPeakArea(row, col);
		}
	}
};

/**
 *	To get the longest path for the given area
 * 
 * @param  {srcRow: the row of the given area}
 * @param  {srcCol: the column of the given area}
 * @return { {
 * 	dstRow:
 * 	dstCol:
 * 	length: 
 * }}
 */
SG_SKI_RESOUT.prototype.getAreaLongestPath = function(srcRow, srcCol) {
	if(this.isBottomArea(srcRow, srcCol)){
		var bestPath = {
			dstRow : srcRow,
			dstCol : srcCol,
			length : 1,
		};

		return bestPath;
	}

	else{

	}
};


var resort = new SG_SKI_RESOUT(filePath);

resort.on('mapRead', (line) => {
	arguments.callee.line = ++arguments.callee.line || 0;
	if(arguments.callee.line == 0){
		// The first line which stores the dimension
		var dimension = line.split(' ');
		resort.rowNum = dimension[0];
		resort.colNum = dimension[1];
		console.log('Row: ' + resort.rowNum + '; Col: ' + resort.colNum);
	}
	else{
		var numBufferString = line.split(' ');
		if(numBufferString.length != resort.colNum){
			console.log('Illegal Ski Resort Map. Please double check the map file');
			process.exit(RETURN_ERR.ERR_ILLEGAL_MAP);
		}

		var numBufferDigit = new Array(numBufferString.length);
		for(var index=0; index<numBufferString.length; index++){
			numBufferDigit[index] = parseInt(numBufferString[index]);
		}
		resort.mapArray.push(numBufferDigit);
	}	
})

resort.on('init', () =>{
	if(resort.mapArray.length != resort.rowNum){
		console.log('Illegal Ski Resort Map. Please double check the map file');
		process.exit(RETURN_ERR.ERR_ILLEGAL_MAP);
	}
	else{
		console.log('End of file and row num is correct');
		resort.getMapBestPath();
	}	
})


