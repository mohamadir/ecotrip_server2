var express = require('express');
var router = express.Router();

/* GET users listing. */


router.get('/', isAdmin, function(req, res){
  res.render('admin');
});

function isAdmin(req, res, next){
  if(req.isAuthenticated())
    if(res.locals.user.role == 'admin')
      return next();

  res.redirect('/');
}

module.exports = router;
