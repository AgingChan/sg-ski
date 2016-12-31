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



class SG_SKI_RESORT extends ev {
	constructor(mapFilePath){
		super();
		let that = this;
		let resortMap = new Array();
		let resortBestPathMap = new Array();

		that.colNum = 0;
		that.rowNum = 0;
		const resortMapFile = mapFilePath;
		var resortBestPath = new SG_SKI_PATH();

		function SG_SKI_PATH(srcLoc, dstLoc, length){
			this.srcLoc = srcLoc;
			this.dstLoc = dstLoc;
			this.length = length;
		}

		SG_SKI_PATH.prototype.setSrcLoc = function(srcLoc) {
			this.srcLoc = srcLoc;
		};

		SG_SKI_PATH.fromKnownMap = function(srcLoc) {
			var dstLoc = that._getLocationBestPathMap(srcLoc).dstLoc;
			var length = that._getLocationBestPathMap(srcLoc).length;
			return (new SG_SKI_PATH(srcLoc, dstLoc,length));
		};

		SG_SKI_PATH.fromNeighbourPath = function (location, neighbour){
			if(!that.isValidLocation(neighbour)){
				//console.log('neighbour is invalid');
				return (new SG_SKI_PATH(location, location, 1));
			}
			else if(that.getLocationElevation(location) <= that.getLocationElevation(neighbour)){
				//console.log('neighbour has a higher altitude');
				return (new SG_SKI_PATH(location, location, 1));
			}
			else{
				//console.log('New Path found');
				var result = new that.getLocationBestPath(neighbour);
				result.srcLoc = location;
				result.length ++;
				return result;
			}
		}

		let mapInterface = readline.createInterface({
			input: fs.createReadStream(resortMapFile),
		})

		mapInterface.on('line', (line) => {
			if(!that.colNum){
				let dimension = line.split(' ');
				that.rowNum = parseInt(dimension[0]);
				that.colNum = parseInt(dimension[1]);
				console.log("Resort Map Size initilize");
			}
			else{
				let numStringBuf = line.split(' ');
				if(numStringBuf.length != that.colNum){
					console.log(numStringBuf.length);
					console.log(that.colNum);
					throw "Illegal Resort Map";
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
			console.log(resortMap);
			console.log(resortBestPathMap);
			that.emit('init');
		})

		this.isValidLocation = function(location){
			return ( (location.row >=0)
					&& (location.row <that.rowNum)
					&& (location.col >=0)
					&& (location.col <that.colNum) );
		}

		this.getLocationElevation = function(location){
			if(that.isValidLocation(location)){
				return resortMap[location.row][location.col];
			}
			else{
				throw 'Invalid Location of the Resort';
			}
		}

		var getPathDeltaElevation = function(path){
			return (that.getLocationElevation(path.srcLoc) - that.getLocationElevation(path.dstLoc));
		}



		var _getLocationBestPathMap =  function(location){
			return resortBestPathMap[location.row][location.col];
		}

		var isBetterPath = function(oldPath, newPath){
			if(typeof oldPath.length === 'undefined'){
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
				console.log("Illegal location");
				console.log(location);
				return new SG_SKI_PATH(LOCATION(0,0), LOCATION(0,0),0 );
			}
			else if(_getLocationBestPathMap(location)){
				console.log("Get Path from the Map");
				return SG_SKI_PATH.fromKnownMap(location);
			}
			else{
				let locBestPath = new SG_SKI_PATH();
				let pathArray = new Array();

				let north = new LOCATION(location.row -1, location.col);
				pathArray.push(SG_SKI_PATH.fromNeighbourPath(location, north));

				let south = new LOCATION(location.row +1, location.col);
				pathArray.push(SG_SKI_PATH.fromNeighbourPath(location, south));

				let east = new LOCATION(location.row, location.col+1);
				pathArray.push(SG_SKI_PATH.fromNeighbourPath(location,east));

				let west = new LOCATION(location.row, location.col-1);
				pathArray.push(SG_SKI_PATH.fromNeighbourPath(location,west));

				pathArray.forEach(function(element){
					if(isBetterPath(locBestPath,element)){
						locBestPath.srcLoc = element.srcLoc;
						locBestPath.dstLoc = element.dstLoc;
						locBestPath.length = element.length;
					}
				})
				// console.log(location);
				// console.log(pathArray);
				// console.log(locBestPath);
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
					if( isBetterPath(resortBestPath,path) ){
						resortBestPath = path;
					}
				}
			}

			console.log(resortBestPath);
		}

		this.getResortBestPathLengthSlope = function(){
			var result;
			if(typeof resortBestPath.length == undefined){
				getResortBestPath();
				return getResortBestPathLengthSlope();
			}
			else{
				result.slope = that.getPathDeltaElevation(resortBestPath);
				result.length= resortBestPath.length;

				console.log("Best Path Length: " + result.length + "; Slope: " + result.slope);

				return result;
			}
		};
	}
} 


//module.exports = SG_SKI_RESORT


let newResort = new SG_SKI_RESORT("./test2.txt");

newResort.on('init', () => {
	newResort.getResortBestPath();
	//newResort.getLocationBestPath(new LOCATION(0,2));
})
