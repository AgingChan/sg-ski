/**
 * SG_SKI_RESORT
 * @authors Aging Chan (aging.chan@gmail.com)
 * @date    2016-12-31 13:17:26
 * @version $Id$
 */

const	_ = require('underscore'),
		ev= require('events'),
		fs= require('fs'),
		readline  = require('readline');


function LOCATION(x,y){
	this.row = x;
	this.col = y;
}

function SG_SKI_PATH(srcLoc, dstLoc, length){
	this.srcLoc = srcLoc;
	this.dstLoc = dstLoc;
	this.length = length;
}

SG_SKI_PATH.prototype.setSrcLoc = function(srcLoc) {
	this.srcLoc = srcLoc;
};

SG_SKI_PATH.fromKnownMap = function(resort,srcLoc) {
	var dstLoc = resort._getLocationBestPathMap(srcLoc).dstLoc;
	var length = resort._getLocationBestPathMap(srcLoc).length;
	return (new SG_SKI_PATH(srcLoc, dstLoc,length));
};

SG_SKI_PATH.fromNeighbourPath = function (resort,location, neighbour){
	if(!resort.isValidLocation(neighbour)){
		return (new SG_SKI_PATH(location, location, 1));
	}
	else if(resort.getLocationElevation(location) <= resort.getLocationElevation(neighbour)){
		return (new SG_SKI_PATH(location, location, 1));
	}
	else{
		var result = new resort.getLocationBestPath(neighbour);
		result.srcLoc = location;
		result.length ++;
		return result;
	}
}


class SG_SKI_RESORT extends ev {
	constructor(mapFilePath){
		super();
		let that = this;
		let resortMap = new Array();
		let resortBestPathMap = new Array();
		const resortMapFile = mapFilePath;
		that.resortBestPath = new SG_SKI_PATH();

		let mapInterface = readline.createInterface({
			input: fs.createReadStream(resortMapFile),
		})

		mapInterface.on('line', (line) => {
			if(that.colNum == undefined){
				let dimension = line.split(' ');
				that.rowNum = dimension[0];
				that.colNum = dimension[1];
				console.log("Resort Map Size initilize");
			}
			else{
				let numStringBuf = line.split(' ');
				if(numStringBuf.length != that.colNum){
					throw new UserException("Illegal Resort Map");
				}

				let numDigitBuf = new Array(numStringBuf.length);
				for(var index=0; index<that.colNum; index++){
					numDigitBuf[index] = parseInt(numStringBuf[index]);
				}

				resortMap.push(numDigitBuf);

				// let unknownPath = new SG_SKI_PATH();
				let pathArray = new Array(numStringBuf.length);
				// pathArray.fill(unknownPath);
				resortBestPathMap.push(pathArray);
			}
		})
		mapInterface.on('close', () => {
			that.emit('init');
			console.log(resortMap);
			console.log(resortBestPathMap);
		})

		this.isValidLocation = function(location){
			return (location.row 
					&& (location.row <that.rowNum)
					&& location.col 
					&& (location.col <that.colNum) );
		}

		this.getLocationElevation = function(location){
			if(that.isValidLocation(location)){
				return resortMap[location.row][location.col];
			}
			else{
				throw new UserException('Invalid Location of the Resort');
			}
		}

		var getPathDeltaElevation = function(path){
			return (that.getLocationElevation(path.srcLoc) - that.getLocationElevation(path.dstLoc));
		}



		var _getLocationBestPathMap =  function(location){
			return resortBestPathMap[location.row][location.col];
		}

		var isBetterPath = function(oldPath, newPath){
			if(typeof oldPath.length == undefined){
				return true;
			}
			else if(newPath.length > oldPath.length){
				return true;
			}
			else if(newPath.length == oldPath.length){
				var newSlope = getPathDeltaElevation(newPath);
				var curSlope = getPathDeltaElevation(oldPath);

				return (newSlope > curSlope)
			}
			else{
				return false;
			}
		}


		this.getLocationBestPath = function(location){
			if(!that.isValidLocation(location)){
				return new SG_SKI_PATH(LOCATION(0,0), LOCATION(0,0),0 );
			}
			else if(_getLocationBestPathMap(location)){
				return SG_SKI_PATH.fromKnownMap(location);
			}
			else{
				var locBestPath = new SG_SKI_PATH();
				var pathArray = new Array();

				var north = new LOCATION(location.row -1, location.col);
				pathArray.push(SG_SKI_PATH.fromNeighbourPath(that,location, north));

				var south = new LOCATION(location.row +1, location.col);
				pathArray.push(SG_SKI_PATH.fromNeighbourPath(that,location, south));

				var east = new LOCATION(location.row, location.col1);
				pathArray.push(SG_SKI_PATH.fromNeighbourPath(that, location,east));

				var west = new LOCATION(location.row, location.col-1);
				pathArray.push(SG_SKI_PATH.fromNeighbourPath(that, location,west));

				pathArray.forEach(function(element){
					if(isBetterPath(locBestPath,element)){
						locBestPath = element;
					}
				})

				return locBestPath;
			}
		}



		this.getResortBestPath = function(){
			for(var row=0; row < that.rowNum; row++){
				for(var col=0; col<that.colNum; col++){
					//TODO: Actually node need to calculate all the node best path
					// 		Just Need to calculate those peak locations
					// Check if thsi could significant improve the performance
					let location = new LOCATION(row,col);
					// Peak is potential best path start point, calculate the best path
					var path = that.getLocationBestPath(location);
					// Compare with the existing Best Path
					if( isBetterPath(that.resortBestPath,path) ){
						that.resortBestPath = path;
					}
				}
			}

			console.log(this.resortBestPath);
		}

		this.getResortBestPathLengthSlope = function(){
			var result;
			if(typeof that.resortBestPath.length == undefined){
				getResortBestPath();
				return getResortBestPathLengthSlope();
			}
			else{
				result.slope = that.getPathDeltaElevation(that.resortBestPath);
				result.length= that.resortBestPath.length;

				console.log("Best Path Length: " + result.length + "; Slope: " + result.slope);

				return result;
			}
		};
	}
} 


//module.exports = SG_SKI_RESORT


let newResort = new SG_SKI_RESORT("./test1.txt");

newResort.on('init', () => {
	newResort.getResortBestPath();
})
