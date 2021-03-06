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
  console.log(id);
  Company.findOne({userid: id}, function(err, data){
    console.log(data);
    if(err) throw err;
    User.findById(id, function(err, user){
      if(err) throw err;
      Attraction.find({userid: id}, function(err, attractions){
        res.render('agent', {
          company: data, 
          user: user,
          attractions: attractions 
        });
      })
      
    })
   
  });
});


router.post('/mail', function(req, res){

const mailer = require('sendgrid-mailer').config('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');
 
var name = req.body.InputName;
var mailosh = req.body.InputEmail;
var message = req.body.InputMessage; 
console.log(name+' ======='+mailosh);
var sg = require('sendgrid')('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');
var request = sg.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: {
    personalizations: [
      {
        to: [
          {
            email: 'ecotrip.app@gmail.com'
          }
        ],
        subject: 'Sending with SendGrid is Fun'
      }
    ],
    from: {
      email: mailosh
    },
    content: [
      {
        type: 'text/plain',
        value: message
      }
    ]
  }
});
sg.API(request, function (error, response) {
  if (error) {
    console.log('Error==================');
  }
  console.log('============== SENT ============ ');
   res.redirect('../');
});
 
});


router.get('/newattraction', isAuthenticated, function(req, res, next){
  res.render('newattraction', {userid: res.locals.user._id});
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
  var path = req.body.path;
  var details = req.body.details;
  var timerating = 0;
  var engoyrating = 0; 
  var rating = 0;
  var price = req.body.price;
  var userid = req.body.userid;

  console.log("===========>>>>> companyid: ", req.body.userid);

  req.checkBody('name', 'Name is require').notEmpty();
  req.checkBody('type', 'Type is require').notEmpty();
  req.checkBody('city', 'City is require').notEmpty();
  req.checkBody('area', 'Area is require').notEmpty();
  req.checkBody('path', 'Attraction Time is require').notEmpty();
  req.checkBody('details', 'Details is require').notEmpty();
  req.checkBody('groups', 'Groups is require').notEmpty();
  req.checkBody('price', 'Price is require').notEmpty();

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
        path: path,
        details: details,
        timerating: timerating,
        engoyrating: engoyrating,
        rating: rating,
        price: price,
        images: images,
        userid: userid,
      });

      console.log(attraction);

      attraction.save(function(err){
        if(err) throw err;
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
router.get('/attraction/:id/edit', function(req,res,next){

  var id = req.params.id;
  Attraction.findById(id,function(err,data){
    if (err) throw err;
    
      res.render('attractionedit', {attraction: data});
    
  });


});

router.post('/update', function(req,res){

  console.log("======>>",req.body);
  
  var attraction_id = req.body.attraction_id;
  //var obj = JSON.parse(attraction);
  
  console.log("======>>",attraction_id);

  var name = req.body.name;
  var type = req.body.type;
  var groups = req.body.groups;
  var lat = 0;
  var lon = 0;
  var city = req.body.city;
  var phone = req.body.phone;
  var area = req.body.area;
  var path = req.body.path;
  var details = req.body.details;
  var price = req.body.price;

  Attraction.findByIdAndUpdate(attraction_id,{ $set: {  
    phone: phone,
    name: name,
    type: type,
    groups: groups,
    city: city,
    area: area,
    path: path,
    details: details,
    price: price
  }}, { new: true },function(err, doc){
    if (err) 
      throw err; 
    res.redirect("/agent");
  });

});

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