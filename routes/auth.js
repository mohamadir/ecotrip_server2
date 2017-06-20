var express = require('express');
var router = express.Router();

var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var Company = require('../models/company');

// Passport config ==========================//
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  }); 
});

passport.use('local-login', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true // allows us to pass back the entire request to the callback
},
function(req, username, password, done) { // callback with email and password from our form

  // find a user whose email is the same as the forms email
  // we are checking to see if the user trying to login already exists
  User.findOne({email: username}, function(err, user) {
    // if there are any errors, return the error before anything else
    if (err)
      return done(err);

    // if no user is found, return the message
    if (!user){
      return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
    }
    // if the user is found but the password is wrong
    if (!user.validPassword(password)){
      return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
    }
    // all is well, return successful user
    return done(null, user);
  });

}));

// route ===========================//
///////////////// regstir agent 
router.get('/register', function(req, res){
  res.render('register')
});

router.post('/register', function(req, res){
  // user 
  var email = req.body.email;
  var password = req.body.password;
  // company
  var name = req.body.name;
  var website = req.body.website;
  var telephone = req.body.telephone;

  req.checkBody('email', 'Email is require').notEmpty();
  req.checkBody('password', 'Password is require').notEmpty();
  req.checkBody('name', 'Name is require').notEmpty();
  req.checkBody('website', 'Website is require').notEmpty();
  req.checkBody('telephone', 'Telephone is require').notEmpty();
  var errors = req.validationErrors();

  User.findOne({email: email}, function(err, user){
    if(err) throw err;

    if(user){
      errors.push({msg: "Email already exists."})
    }

    // check valdation
    if(errors){
      res.render('register', {errors: errors})
    }else{
      var user = new User;
      user.email = email;
      user.password = user.generateHash(password);
      user.role = "agent";


      var company = new Company({
        name: name,
        website: website,
        telephone: telephone,
        userid: user._id
      });


      user.save(function(err){
        if(err) throw err;
        company.save(function(err){
          if(err) throw err;
          res.redirect('/');
        });
      });   
    }
  });

});

//////////////////////login 
router.get('/login/admin', function(req, res){
  res.render('loginadmin');
});

router.post('/login/admin', passport.authenticate('local-login', {
  failureRedirect : '/auth/login/admin', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}),
  function(req, res, next){
    res.redirect('/admin');
});

router.get('/login/agent', function(req, res){
  res.render('loginagent');
});

router.post('/login/agent', passport.authenticate('local-login', {
  failureRedirect : '/auth/agent', // redirect back to the signup page if there is an error
  failureFlash : true // allow flash messages
}),
  function(req, res, next){
    userid = req.user._id;
    res.redirect('/agent?id=' + userid);
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

function isAuthenticated(req, res, next){
  if(req.isAuthenticated());
    return next();

  res.redirect('/');
}

function isAdmin(req, res, next){
  if(req.isAuthenticated());
    if(res.locals.user.role == 'admin')
      return next();

  res.redirect('/');
}

// New Admin Temp
/*
router.get('/admin/register', function(req, res){
  var user = new User;
  user.email = "hosen@admin.com";
  user.password = user.generateHash("admin123");
  user.role = "admin";

  user.save(function(err){
    if(err) throw err;
    res.redirect('/auth/login/admin');
  });
});*/

module.exports = router;