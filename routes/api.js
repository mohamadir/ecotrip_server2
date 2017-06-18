var express = require('express');
var router = express.Router();
var Attraction = require('../models/attraction');
var User=require('../models/user');
var weather = require('weather-js');


//********************************************   weather routes     ***************************************8 */
router.post('/attraction/weather',function(req,res,next){
      
      var location= req.body.location;
      console.log(location);
      weather.find({search: location, degreeType: 'C'}, function(err, result) {
        if(err) console.log(err);
      
        console.log(JSON.stringify(result, null, 2));
        res.json(result);
});
});
router.post('/attraction/weather/one',function(req,res,next){
      
     Attraction.find({type: {$in:["אטרקציות ימיות","אטרקציות בטבע","ספורט ימי/צלילה / שיט"]}}
     , function(err, result){ 
          if (err) throw err;
          res.json(result); 
});
});
router.post('/attraction/weather/two',function(req,res,next){
      
      Attraction.find({type: {$in:["גני חיות / פינות ליטוף","טרקטרונים / קטרינג / רייזרים","סיורים"]}}, function(err, result){ 
          if (err) throw err;
          res.json(result);
});
});
router.post('/attraction/weather/three',function(req,res,next){
      
      Attraction.find({type: {$in:["גני חיות / פינות ליטוף","טרקטרונים / קטרינג / רייזרים","סיורים"]}}, function(err, result){ 
          if (err) throw err;
          res.json(result);
});
});


/* GET users listing. */
router.post('/attraction/getall', function(req, res, next) {
  var id=req.body.UserId;
  Attraction.find({}, function(err, data){
    if(err) throw err;
     User.findByIdAndUpdate(id ,{ $inc: { searchnum: 1 } },function(err,data2){
                if(err)
                  throw err;
                console.log("success");
                    res.send("id:  "+id);
              });
  }).sort({engoyrating:-1});
});

router.post('/attraction/setreview', function(req, res, next) {
    var review=req.body.review;
    var date=req.body.date;
    var reviewObject={review:review,date: date};
    var id=req.body.id;
    Attraction.findByIdAndUpdate(
    id,
        {$push: {"reviews": reviewObject}},
        {safe: true, upsert: true},
        function(err, data) {
      if(err) throw err;
        Attraction.findById(id,function(err,data2){
          res.json(data2);
        });
        }
);
});

router.post('/attraction/getreviews', function(req, res, next) {
    var id=req.body.id;
    Attraction.findById(id,function(err, data) {
      if(err) throw err;
        res.json(data);
        }
);
});
router.get('/attraction/getall2', function(req, res, next) {  
  //var id=req.body.UserId;
  Attraction.find({}, function(err, data){
    if(err) throw err;
        res.json(data);
  }).sort({engoyrating:-1});
});

router.post('/attraction/search', function(req, res, next) {
  var id=req.body.UserId;
  	Attraction.find({},function(err,data){
  		    if(err) throw err;
          
  		 User.findByIdAndUpdate(id ,{ $inc: { searchnum: 1 } },function(err,data2){
                if(err)
                  res.json(data);
                else
                    res.json(data);
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
                   if(err) throw err;
                    res.json(result);
  }); 
});


router.post('/attraction/special_attractions', function(req, res, next) {
  console.log(req.body.userId);
		let finalResult = {};
		let types=req.body.type;
    let area=req.body.area;
    let type=req.body.type;
    let path=req.body.path;
    let groups=req.body.groups;
    let id=req.body.UserId;
    console.log("------------ id :"+id);
    let where = {};
    if(type.length>0)
      where["type"]= { $in: type };
    if(groups.length>0)
       where["groups"]= {$in: groups};
    if(area)
       where["area"]= area;
    if(path)
       where["time"]= path;
 

      Attraction.find(where, function(err, result){ 
                    console.log("hi"+result);
           User.findByIdAndUpdate(id ,{ $inc: { searchnum: 1 } },function(err,data){
                if(err){
                  console.log(err);
                  res.json(result);

                }
              else
                res.json(result);
                  
            });
                         }).sort({engoyrating:-1}).limit(8);

});


router.post('/user/getcount',function(req,res,next){
  var id=req.body.UserId;
  console.log("id----------", id);
  User.findById(id,function(err,data){
                if(err)
                  res.json(data);;
                res.json(data);
            });
});
router.post('/attraction/set_rating',function(req,res,next){
      let id=req.body.id;
      let rate=req.body.erating;
            Attraction.findByIdAndUpdate(id,{"$push":{"rating":rate}},{"new":true,"upsert":true},function(err,data){
                if(err)
                  throw err;
                res.json(data);
            });


});
router.post('/attraction/set_engoyrating',function(req,res,next){
      let er=req.body.rateAvg;
      let id=req.body.id;
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
    let id=req.body.UserId;
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
             User.findByIdAndUpdate(id ,{ $inc: { searchnum: 1 }, },function(err,data){
                if(err) res.json(finalResult);
                else 
                    res.json(finalResult);
              });
    });
});
var updateRecomended=function(type,recomended){
  var newRecomended=[{}];
    for (var i = 0; i < type.length; i++) {
      var ifExist=false;
      for(var j=0;j<recomended.length;j++)
      {
          if(type[i]==recomended[j])
          {
            var newR={type:type[j],count: recomended[j].count+1};
            newRecomended.push(newR);
            ifExist=true;
          }
          if(ifExist)
            break;
          else
            {
              var newR={type:type[j],count: 0};
              newRecomended.push(newR);

            }
      }
  }
return newRecomended;
}


module.exports = router;


