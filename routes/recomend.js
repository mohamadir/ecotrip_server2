var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Attraction = require('../models/attraction');

router.post('/get_recomended',function(req,res,next){

    console.log('---------hi');
    var id=req.body.id;
    var type=req.body.type;
    console.log(id);
    User.findByIdAndUpdate(id ,{ $inc: { searchcount: 1 } },function(err,data){
                if(err)
                  throw err;
                console.log("success");
                
                res.json(data);
              });
/*
    User.find({_id: id},function(err,user){
        if(err) throw err;
        var recomended=user.recomended;
        for(var i=1;i<recomended.length();i++)
        {
            
        }
        
    });*/
    


});

module.exports = router;