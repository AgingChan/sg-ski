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
if(semver.lt(process.version,'6.0.0')){
	console.log('Node version mismatch');
	process.exit(1);
}

var filePath = '';

// Parameter Handling
if(process.argv.length > 3){
	console.log("Unexpected arguments");
	console.log("Please try this 'node sg-ski.js [map file]'");
	process.exit(1);
}
else if(process.argv.length === 3){
	filePath = process.argv[2];
}
else{
	filePath = "./test1.txt" 
}

console.log('Map File: ' + filePath);
let rowNum = 0;
let colNum = 0;
let resortMap = new Array(0);

var rd = readline.createInterface({
	input: fs.createReadStream(filePath),
})

rd.on('line', (line) => {
	arguments.callee.line = ++arguments.callee.line || 0;
	if(arguments.callee.line == 0){
		// The first line which stores the dimension
		var dimension = line.split(' ');
		rowNum = dimension[0];
		colNum = dimension[1];
		console.log('Row: ' + rowNum + '; Col: ' + colNum);
	}
	else{
		resortMap.push(line.split(' '));
		//console.log(line.split(' '));
		if(arguments.callee.line >= colNum){
			// The last line
			console.log(resortMap);
		}
	}
})



function SG_SKI_RESOUT(mapFilePath){
	let that = this;
	this.mapArray = new Array(0);
	this.mapFilePath = mapFile;
	this.mapReadlineInterface = readline.createInterface({
		input: fs.createReadStream(that.mapFilePath);
	})

	this.mapReadlineInterface.on('line' (line) =>{
		
	})
}


