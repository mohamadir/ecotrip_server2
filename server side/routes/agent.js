var express = require('express');
var router = express.Router();
var Attraction = require('../models/attraction');
var Company = require('../models/company');
var User = require('../models/user');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var FileReader = require('filereader');
var fs = require('fs');
var geocoder = require('geocoder');


/* GET users listing. */
router.get('/', isAuthenticated, function(req, res){
  id = req.query.id || res.locals.user._id;
  Company.findOne({userid: id}, function(err, data){
    if(err) throw err;
    User.findById(id, function(err, user){
      if(err) throw err;
      Attraction.find({}, function(err, attractions){
        res.render('agent', {
          company: data, 
          user: user,
          attractions: attractions 
        });
      })
      
    })
   
  });
});


router.get('/newattraction', isAuthenticated, function(req, res, next){
  Company.findOne({userid: res.locals.user._id}, function(err, data){
    if(err) throw err;
    console.log(data)
    res.render('newattraction', {company: data});
  });
  
});

router.post('/newattraction', isAuthenticated, upload.array('images', 12), 
  function(req, res, next){  
  var name = req.body.name;
  var type = req.body.type;
  var groups = req.body.groups;
  var lat = 0;
  var lon = 0;
  var city = req.body.city;
  var phone = req.body.phone;
  var area = req.body.area;
  var time = req.body.time;
  var details = req.body.details;
  var timerating = 0;
  var engoyrating = 0; 
  var rating = 0;
  var price = req.body.price;
  var companyid = req.body.company._id;

  // req.checkBody('name', 'Name is require').notEmpty();
  // req.checkBody('type', 'Type is require').notEmpty();
  // req.checkBody('city', 'City is require').notEmpty();
  // req.checkBody('area', 'Area is require').notEmpty();
  // req.checkBody('time', 'Time is require').notEmpty();
  // req.checkBody('details', 'Details is require').notEmpty();
  // req.checkBody('groups', 'Groups is require').notEmpty();
  // req.checkBody('price', 'Price is require').notEmpty();
  //req.checkBody('images', 'Images is require').notEmpty();

  var images = [];
  for(var i = 0; i < req.files.length; i++) {
    images.push({
      "src": req.files[i].filename,
      "base64": new Buffer(fs.readFileSync(req.files[i].path)).toString("base64")
    });
    fs.unlink(req.files[i].path);
  }

  var errors = req.validationErrors();

  geocoder.geocode(city, function(err, results){
    lat = results.results[0].geometry.location.lat;
    lon = results.results[0].geometry.location.lng;
    console.log("lat: " + lat + ", lon: " + lon);

    if(errors){
      res.render('newattraction', {errors: errors})
    }else{
      var attraction = new Attraction({
        name: name,
        type: type,
        groups: groups,
        address: {
          lat: lat,
          lon: lon
        },
        city: city,
        phone: phone,
        area: area,
        time: time,
        details: details,
        timerating: timerating,
        engoyrating: engoyrating,
        rating: rating,
        price: price,
        images: images,
        companyid: companyid
      });

      attraction.save(function(err){
        if(err) throw err;
        console.log("=====>>>> Success");
        res.redirect('/agent');
      });
    }
  });

});

function isAuthenticated(req, res, next){
  if(req.isAuthenticated())
    return next();

  res.redirect('/');
}

router.get('/address', function(req, res, next){
  geocoder.geocode('new york', function(err, results){
    //var data = results[0].geometry;
    console.log(results.results);
    res.json(results.results[0].geometry.location);
  });
});
/*router.post("/upload", upload.array("images", 12), function(req, res, next) {
 
});
*/
router.post('/delete', function(req, res){
  var userId = req.body.userId || req.query.userId;

  console.log("userId: =======>>>>>>>> ", userId);

   Attraction.remove({_id: userId}, function(err, data) {
       if (err) { 
        res.json({"err": err}); 
      } else { 
        res.json({success: true});
      }
   });
});

module.exports = router;