var express = require('express');
var router = express.Router();

var User = require('../models/user');

router.post('/register', function(req, res, next) {
     User.findOne({email: req.body.email}, function(err, user){
    if(err) {
        console.log(err);
        throw err};
    if(user){
      console.log('existtttt');
      res.json({status: "email already exist"});
    }
    console.log(req.body);
      var user = new User;
      user.email = req.body.email;
      user.password =req.body.password;
      user.role = "user";
      user.firstName=req.body.firstName;
      user.lastName=req.body.lastName;
      user.searchnum=0;
      user.save(function(err){
        if(err){ 
            consol.log(err);
            throw err};
          console.log('im here');
        res.json({status: "success"});
      });   
    
  });
 
});

router.post('/login',function(req,res,next){
        var email=req.body.email;
        var password=req.body.password;
        console.log(req.body);
         User.findOne({email: email,password: password}, function(err, user){

            if(user&& user.role=='user'){
                console.log('user.password:'+user.password+",req.password:"+req.body.password);
/*                if(user.password=password)
                  res.json({status:'success',user: user});
                else
                  res.json({status:'password wrong'});*/
                  res.json({status:'success',user: user});
            }
            else
                res.json({status:'wron details'});
         });
});


module.exports = router;

