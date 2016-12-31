/**
 * Singpore Skiing
 * @authors Aging Chan (aging.chan@gmail.com)
 * @date    2016-12-30 09:51:05
 * @version $Id$
 */

const semver = require('semver');
// Check the Node version
if(semver.lt(process.version,'6.0.0')){
	throw "Please install the latest Node.( >= 6.0.0)"
	process.exit(1)
}

const SG_SKI_RESORT = require('./sg_ski_resort.js');

var filePath = '';

// Parameter Handling
if(process.argv.length > 3){
	throw "Usage: node sg-ski.js [map file]";
	process.exit(RETURN_ERR.ERR_INVALID_ARGUMENTS);
}
else if(process.argv.length === 3){
	filePath = process.argv[2];
}
else{
	filePath = "./test1.txt" 
}

console.log('Map File: ' + filePath);


var newResort = new SG_SKI_RESORT(filePath);

newResort.on('init', () => {
	newResort.getResortBestPathLengthSlope();
	//newResort.getLocationBestPath(new LOCATION(0,2));
})

