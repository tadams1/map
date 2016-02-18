var MongoClient = require('mongodb').MongoClient
  , assert = require('assert'), cfg = require('./config');


function layers() {
	this.strPolygons = "init";
  this.strPoints = "init";
  this.pageInfo = "init";
	this.db = null;
	console.log("Object Created:")
}


layers.prototype.runQuery = function() {
  this.db.collection(this.geoname).find({'geometry.type': 'Point'},{'_id': false}).toArray(function (err, items) {
    console.log(items);
    console.log(err); 
      console.log("Object Created:")
  });

}

layers.prototype.getDBData = function(callback, geotype, myobj) {
	this.db.collection(this.geoname).find({'geometry.type': geotype},{'_id': false}).toArray(function (err, items) {
		var obj1 = {	
				"type": "FeatureCollection",
  				"features": []
  			}
		obj1.features = items;//push(obj1.features[0]);
		//console.log(obj1);
		var strJSONData = JSON.stringify(obj1);
		callback(strJSONData,geotype, myobj);

	});
}

layers.prototype.getPageInfoData = function(callback, myobj) {
  this.db.collection(this.infoname).find({}).toArray(function (err, items) {
    var obj1 = {  
        "types": [],
        "mapprefix": cfg.mapprefix
        }
    obj1.types = items;//push(obj1.features[0]);
    console.log(obj1);
    var strJSONData = JSON.stringify(obj1);
    callback(strJSONData, myobj);

  });
}

layers.prototype.init = function(geoname, infoname) {
  this.geoname = geoname;
  this.infoname = infoname;
	this.connectDB(this.callFetch, this);
	this.testVal = "2";
}

layers.prototype.refreshPageInfo = function(obj) {
    this.db.collection(this.infoname).find({}).toArray(function (err, items) {
    var obj1 = {  
        "types": [],
        "mapprefix": cfg.mapprefix
        }
    obj1.types = items;//push(obj1.features[0]);
    console.log(obj1);
    obj.pageInfo = JSON.stringify(obj1);
  });
}

layers.prototype.callFetch = function(theDB, myobj) {
	myobj.db = theDB;
	myobj.getDBData(myobj.updateJSON, "Point", myobj);  
  myobj.getDBData(myobj.updateJSON, "Polygon", myobj);
  myobj.getPageInfoData(myobj.updateInfoJSON, myobj);
}

layers.prototype.connectDB = function(callback, myobj) {
	var url = cfg.mongodb.url;
	MongoClient.connect(url, function(err, db) {
		assert.equal(null, err);
		console.log("Connected correctly to server");
		console.log("err:" + err);
		callback(db, myobj);
	});
}



layers.prototype.updateJSON = function(res, geotype, myobj) {
  if(geotype=="Point") {
	   myobj.strPoints = res;
  } else {
      myobj.strPolygons = res;
  }
	console.log("updateJSON: " + res);
}

layers.prototype.updateInfoJSON = function(res, myobj) {
  myobj.pageInfo = res;
  console.log("updateJSON: " + res);
}

module.exports = layers

layers.prototype.savePointer = function(newJSON) {
	this.db.collection(cfg.mongodb.col).insert(newJSON);
}

layers.prototype.addHTML = function() {
        var pageInfo = {
        "types": 
           [
            {
              "id": "Dev",
              "text": "Development",
              "title": "Industrial or residential",
              "type": "threat"
            },
            
            {
              "id": "RecImpact",
              "text": "Recreational",
              "title": "e.g. Off-leash dogs, off-road driving",
              "type": "threat"
           },
    
           {
              "id": "BadWaterMgmt",
              "text": "Inappropriate water management",
              "type": "threat"
           },
          
           {
              "id": "Weeds",
              "text": "Weeds invasion",
              "type": "threat"
           },
           {
              "id": "IntroPred",
              "text": "Introduced Predators",
              "type": "threat"
           },
           {
              "id": "Pollution",
              "text": "Pollution",
              "type": "threat",
           },
           {
              "id": "Clim",
              "text": "Climate change",
              "type": "threat"
           },

           {
              "id": "ShowLove",
              "text": "Show the love for shorebirds",
              "type": "action"
            },
            {
              "id": "PetIt",
              "text": "Sign a petition",
              "type": "action"
            },
           
           
            {
              "id": "Education",
              "text": "Education and events",
              "type": "action"
            },
           
            {
              "id": "HabitatRes",
              "text": "Habitat restoration or care",
              "type": "action"
            },
           
            {
              "id": "Advocoacy",
              "text": "Advocacy",
              "title": "Saving shorebird habitat",
              "type": "action"
            },
            {
              "id": "impbirdsite",
              "text": "Important Bird Areas",
              "type": "layer"
            },
            {
              "id": "ramsar",
              "text": "Ramsar Sites",
              "type": "layer"
            }
          ]
      };

        var url = cfg.mongodb.url;
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      console.log("Connected correctly to server");

      for(var i=0;i<pageInfo.types.length;i++) {
                db.collection('pageinfo').insert(pageInfo.types[i]);
      }

    });
}

layers.prototype.testsave = function () {
	var url = cfg.mongodb.url;
	MongoClient.connect(url, function(err, db) {
	  	assert.equal(null, err);
	  	console.log("Connected correctly to server");

	  	console.log(err);

      var dt = new Date();

	var myj2= {
      				"type": "Feature",
      				"properties": 
      				{
            "type": "layer",
            "typeid": "impbirdsite",
            "typetext": "Important Bird Sites",
            "comment": "This is an Important Bird site",
            "icon": "",
            "link": "http://www.birdsites.com",
            "yourname": "Toby",
            "youremail": "tadams1@gmail.com",
            "datesaved":  dt.toJSON()
      				},
      				"geometry": 
      				{
        				"type": "Polygon",
        				"coordinates": [
          				[
            				[123.61, -22.14], [122.38, -21.73], [121.06, -21.69], [119.66, -22.22], [119.00, -23.40],
            				[118.65, -24.76], [118.43, -26.07], [118.78, -27.56], [119.22, -28.57], [120.23, -29.49],
            				[121.77, -29.87], [123.57, -29.64], [124.45, -29.03], [124.71, -27.95], [124.80, -26.70],
       				     	[124.80, -25.60], [123.61, -25.64], [122.56, -25.64], [121.72, -25.72], [121.81, -26.62],
       				     	[121.86, -26.98], [122.60, -26.90], [123.57, -27.05], [123.57, -27.68], [123.35, -28.18],
            				[122.51, -28.38], [121.77, -28.26], [121.02, -27.91], [120.49, -27.21], [120.14, -26.50],
       				     	[120.10, -25.64], [120.27, -24.52], [120.67, -23.68], [121.72, -23.32], [122.43, -23.48],
            				[123.04, -24.04], [124.54, -24.28], [124.58, -23.20], [123.61, -22.14]
          				]
        				]	
      				}
      			}
      	console.log(myj2);

      	db.collection(cfg.mongodb.col).insert(myj2);

	 myj2=     {
      "type": "Feature",
      "properties": {
            "type": "layer",
            "typeid": "ramsar",
            "typetext": "Ramsar Sites",
            "comment": "This is a Ramsar site",
            "icon": "",
            "link": "http://www.ramsar.com",
            "yourname": "Toby",
            "youremail": "tadams1@gmail.com",
            "datesaved":  dt.toJSON()
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [128.84, -25.76], [128.18, -25.60], [127.96, -25.52], [127.88, -25.52], [127.70, -25.60],
            [127.26, -25.79], [126.60, -26.11], [126.16, -26.78], [126.12, -27.68], [126.21, -28.42],
            [126.69, -29.49], [127.74, -29.80], [128.80, -29.72], [129.41, -29.03], [129.72, -27.95],
            [129.68, -27.21], [129.33, -26.23], [128.84, -25.76]
          ],
          [
            [128.45, -27.44], [128.32, -26.94], [127.70, -26.82], [127.35, -27.05], [127.17, -27.80],
            [127.57, -28.22], [128.10, -28.42], [128.49, -27.80], [128.45, -27.44]
          ]
        ]
      }
    }

    console.log(myj2);

    db.collection(cfg.mongodb.col).insert(myj2);

        });

}


