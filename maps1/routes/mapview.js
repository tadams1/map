var express = require('express');
var router = express.Router();
var fs = require('fs-extra');
var formidable = require('formidable');
var util = require('util');

/* GET home page. */
router.get('/', function(req, res, next) {
	// Connection URL
	// Use connect method to connect to the Server

	var layers = req.app.get('layers');
	console.log('in request')
	console.log("Req:" + layers.strPoints);
	console.log("PI" + layers.pageInfo);
	res.render('mapview', { view : "'" + req.query.view + "'", pageInfo: layers.pageInfo});
});

router.post('/', function(req, res, next) {
	var layers = req.app.get('layers');

	var form = new formidable.IncomingForm
	var fields = {};

	form.on('field', function(name, value) {
		fields[name]= value;
	});

	form.on('end', function() {

		var parts = fields['thedate'].split('-');
  		var dt =  Date(parts[0], parts[1]-1, parts[2]); //
  		var newJSON = {
  			"type": "Feature",
  			"properties": {
  				"type": fields['type'],
  				"typeid": fields['typeid'],
  				"typetext": fields['typetext'],
  				"comment": fields['type'],
  				"icon": "images/" + fields['type'] + "marker.png",
  				"link": fields['type'],
  				"validated": false,
  				"lastname": fields['lastname'],
  				"firstname": fields['firstname'],
  				"youremail": fields['emailaddr'],
  				"datesaved":  dt
  			},
  			"geometry": 
  			{
  				"type": "Point",
  				"coordinates": [parseFloat(fields['long']), parseFloat(fields['lat'])]
  			}
  		}

  		if(this.openedFiles.length > 0) {
  			var temp_path = this.openedFiles[0].path;
  			var file_name = this.openedFiles[0].name;

  			console.log('upload' + fields['lastname'] + file_name);

  			/* Location where we want to copy the uploaded file */
  			var new_location = 'uploadedimages/';
  			newJSON.properties.filelink = new_location + file_name;

  			fs.copy(temp_path, 'public/' + new_location + file_name, function(err) {  
  				if (err) {
  					console.error("File copy failed: " + err);
  				} else {
  					console.log("File copied!")
  				}

  				fs.remove(temp_path, function (err) {
  					if (err) {
  						console.error('File remove failed: ' + err);
  					} else	{
  						console.log('Temp file removed!')
  					}
  				});
  			});


  		}
  		console.log('Saving: ' + JSON.stringify(newJSON));
  		layers.savePointer(newJSON);
  		res.status(200);
  		res.send({"result": "sucess"});
  		res.end();

  	});

	form.parse(req);

});

module.exports = router
