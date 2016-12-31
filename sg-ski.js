/**
 * Singpore Skiing
 * @authors Aging Chan (aging.chan@gmail.com)
 * @date    2016-12-30 09:51:05
 * @version $Id$
 */

const SG_SKI_RESORT = require('./sg_ski_resort.js'),
			semver = require('semver');
// Check the Node version

const RETURN_ERR = {
	SUCCESS: 0,
	ERR_INVALID_ARGUMENTS: 1,
	ERR_ILLEGAL_MAP: 2,
}



if(semver.lt(process.version,'6.0.0')){
	throw "Please install the latest Node.( >= 6.0.0)"
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


let newResort = new SG_SKI_RESORT(filePath);

newResort.on('init', () => {
	newResort.getResortBestPathLengthSlope();
	//newResort.getLocationBestPath(new LOCATION(0,2));
})

