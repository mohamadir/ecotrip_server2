var express = require('express');
var router = express.Router();
var Company = require('../models/company');
var Attraction = require('../models/attraction');
var User = require('../models/user');

/* GET users listing. */


router.get('/', isAdmin, function(req, res){ 
  User.find({}, function(err, data){
    Company.find({}, function(err, data){
      Company.count({}, function( err, companyCount){
        Attraction.count({}, function( err, attractionCount){
          res.render('admin/index', { companyCount: companyCount, attractionCount: attractionCount });
        })
      }) 
    });
  });
});

router.get('/company', isAdmin, function(req, res){
  Company.find({}, function(err, data){
    res.render('admin/company',{companies: data});
  });
});

function isAdmin(req, res, next){
  if(req.isAuthenticated())
    if(res.locals.user.role == 'admin')
      return next();

  res.redirect('/');
}

router.post('/company/delete', function(req, res){
  var companyId = req.body.id ;

  console.log("companyId: =======>>>>>>>> ", companyId);

    Company.remove({_id: companyId}, function(err, data) {
      if (err) { 
        console.log(err);
      } 
      res.redirect('/admin/company')
   });
});

module.exports = router;
