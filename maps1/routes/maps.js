var express = require('express');
var router = express.Router();
var cfg = require('../config')


function getCSVData(val) {
  if(val == null || val == undefined){
    return '';
  } else if (val instanceof Date) {
    return d.getDate() + "-" + (d.getMonth()+1) + "-" + d.getFullYear();
  } else {
    return val.replace(/,/g,'.').replace(/(?:\r\n|\r|\n)/g, '[LF]');
  }
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  var layers = req.app.get('layers');
	var collection = layers.db.collection(cfg.mongodb.col);

  var clause;
  if(req.query.type == "ALL") {
    clause = {};
  }else if(req.query.type == "ALLTYPE") {
    clause={"properties.type": req.query.types};
  } else {
    clause={"properties.typeid": req.query.type};
  }
  collection.find(clause,{'_id': 0, "properties.youremail": 0}).toArray(function(e,docs){ 
    var obj1 = {	
      "type": "FeatureCollection",
      "features": []
    }
    
    if(req.query.format == 'CSV') {
      var s = "type,typeid,typetext,comment,icon,link,name,email,date,longitute,latitude\n";
      for(var i = 0; i<docs.length; i++){
        s += getCSVData(docs[i].properties.type) + ',' + getCSVData(docs[i].properties.typeid) + ',' + getCSVData(docs[i].properties.typetext) + ',';
        s += getCSVData(docs[i].properties.comment) + ','+ getCSVData(docs[i].properties.icon) + ',' + getCSVData(docs[i].properties.link) + ',';
        s += getCSVData(docs[i].properties.yourname) + ',' + getCSVData(docs[i].properties.youremail)  + ',' + getCSVData(docs[i].properties.datesave) + ',';
        s += docs[i].geometry.coordinates[0] + ',' + docs[i].geometry.coordinates[1] + '\n';
      }
      res.contentType('csv');
      res.send(s);

    } else {
      obj1.features = docs;
      res.setHeader('Content-Type', 'application/json');
      res.json(obj1);

    }
  });


});

module.exports = router;
