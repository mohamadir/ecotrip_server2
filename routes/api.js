var express = require('express');
var router = express.Router();

var Attraction = require('../models/attraction');
var User=require('../models/user');
/* GET users listing. */
router.post('/attraction/getall', function(req, res, next) {
  Attraction.find({}, function(err, data){
    if(err) throw err;
    res.json(data);
  })
});

router.get('/attraction/getall2', function(req, res, next) {
  Attraction.find({}, function(err, data){
    if(err) throw err;
     User.findByIdAndUpdate(id ,{ $inc: { searchcount: 1 } },function(err,data){
                if(err)
                  throw err;
                console.log("success");
                
                    res.json(result);
              });
  }).sort({engoyrating:-1});
});

router.post('/attraction/search', function(req, res, next) {
  	Attraction.find({},function(err,data){
  		    if(err) throw err;
          
  		 User.findByIdAndUpdate(id ,{ $inc: { searchcount: 1 } },function(err,data){
                if(err)
                  throw err;
                console.log("success");
                
                    res.json(result);
              });
  	});
});
router.post('/attraction/attraction_detail', function(req, res, next) {

      let id=req.body.id;
      console.log(req.body);
      Attraction.findById(id,function(err,data){
          if(err) throw err;
                console.log(data);

      res.json(data);
    });

});

router.post('/attraction/favorite', function(req, res, next) {
  let ids = req.body.ids;

  console.log("Ids:",ids);

  Attraction.find({ '_id': { $in: ids }}, function(err, result){ 
     User.findByIdAndUpdate(id ,{ $inc: { searchcount: 1 } },function(err,data){
                if(err)
                  throw err;
                console.log("success");
                
                    res.json(result);
              });
  }); 
});


router.post('/attraction/special_attractions', function(req, res, next) {
		let finalResult = {};
		let types=req.body.type;
    let area=req.body.area;
    let type=req.body.type;
    let path=req.body.path;
    let groups=req.body.groups;
    let ip=req.body.userId;
    let where = {}
    if(type.length>0)
      where["type"]= { $in: type };
    if(groups.length>0)
       where["groups"]= {$in: groups};
    if(area)
       where["area"]= area;
    if(path)
       where["time"]= path;

    console.log(where);

      Attraction.find(where, function(err, result){ 
                    console.log("hi"+result);
           User.findByIdAndUpdate(id ,{ $inc: { searchcount: 1 } },function(err,data){
                if(err)
                  throw err;
                console.log("success");
                
                    res.json(result);
              });
                         }).sort({engoyrating:-1}).limit(8);

});



router.post('/attraction/set_rating',function(req,res,next){
      let id=req.body.id;
      let rate=req.body.erating;
     /* Attraction.findById(id, function(err,result){
        let rating= result.rating;
        rating.push(rate);
        Attraction.update({})

      });
      */
            Attraction.findByIdAndUpdate(id,{"$push":{"rating":rate}},{"new":true,"upsert":true},function(err,data){
                if(err)
                  throw err;
                res.json(data);
            });


});
router.post('/attraction/set_engoyrating',function(req,res,next){
      let er=req.body.rateAvg;
      let id=req.body.id;
      console.log(er +","+id);
      Attraction.findByIdAndUpdate(id,{$set:{"engoyrating":er}},function(err,data){
                if(err)
                  throw err;
                console.log("success");
                res.json(data);
              });
});
 
router.post('/attraction/bestpath',function(req,res,next){
    let types=req.body.type;
    let finalResult=[];
    let area=req.body.area;
    let type=req.body.type;
    let path=req.body.path;
    let groups=req.body.groups;
    let where = {}
    if(type.length>0)
      where["type"]= { $in: type };
    if(groups.length>0)
       where["groups"]= {$in: groups};
    if(area)
       where["area"]= area;
    if(path)
       where["time"]= path;
    Attraction.find(where, function(err, resu){ 
        console.log(types+"-------");
        if (err) throw err;
        types.map((type)=>{
            let ind=0;
            let max=0;
            let exist=false;
            console.log("type:====",type);
            resu.map((attraction, index)=>{

                 if(type == attraction.type){
                  exist=true;
                    if(attraction.engoyrating>max){
                        max=attraction.engoyrating;
                        ind=index;
                    }
                  
                }
            });
            if(exist)
               finalResult.push(resu[ind]);

        });
             User.findByIdAndUpdate(id ,{ $inc: { searchcount: 1 } },function(err,data){
                if(err)
                  throw err;
                console.log("success");
                
                    res.json(result);
              });;
    });

});

module.exports = router;


