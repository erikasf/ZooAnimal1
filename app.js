var express = require("express"),
app = express(),
bodyParser = require("body-parser"),
methodOverride = require('method-override'),
db = require("./models");

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));


/********* zoos ROUTES *********/

// ROOT
app.get('/', function(req,res){
  res.redirect("/zoos");
});

// INDEX
app.get('/zoos', function(req,res){
  db.zoo.find({},
    function (err, zoos) {
      res.render("zoos/index", {zoos:zoos});
    });
});

// NEW
app.get('/zoos/new', function(req,res){
  res.render("zoos/new");
});

// CREATE
app.post('/zoos', function(req,res){
  db.zoo.create({name: req.body.Name,location: req.body.location}, function(err, zoo){
    if(err) {
      console.log(err);
      res.render("zoos/new");
    }
    else {
      console.log(zoo);
      res.redirect("/zoos");
    }
  });
});

// SHOW
app.get('/zoos/:id', function(req,res){
  db.zoo.findById(req.params.id,
    function (err, zoo) {
      db.animal.find(
      {
        _id: {$in: zoo.animals}
      },
      function(err, animals){
        res.render("zoos/show", {zoo:zoo, animals:animals});
      });
    });
});

// EDIT
app.get('/zoos/:id/edit', function(req,res){
  db.zoo.findById(req.params.id,
    function (err, zoo) {
      res.render("zoos/edit", {zoo:zoo});
    });
});

// UPDATE
app.put('/zoos/:id', function(req,res){
 db.zoo.findByIdAndUpdate(req.params.id, {name: req.body.tName,location: req.body.location},
     function (err, zoo) {
       if(err) {
         res.render("zoos/edit");
       }
       else {
         res.redirect("/zoos");
       }
     });
});

// DESTROY
app.delete('/zoos/:id', function(req,res){
  db.zoo.findById(req.params.id,
    function (err, zoo) {
      if(err) {
        console.log(err);
        res.render("zoos/show");
      }
      else {
        zoo.remove();
        res.redirect("/zoos");
      }
    });
});

/********* animals ROUTES *********/

// INDEX
app.get('/zoos/:zoo_id/animals', function(req,res){
  db.zoo.findById(req.params.zoo_id).populate('animals').exec(function(err,zoo){
    res.render("animals/index", {zoo:zoo});
  });
});

// NEW
app.get('/zoos/:zoo_id/animals/new', function(req,res){
  db.zoo.findById(req.params.author_id,
    function (err, zoo) {
      res.render("animals/new", {zoo:zoo});
    });
});

// CREATE
app.post('/zoos/:zoo_id/animals', function(req,res){
  db.animal.create({title:req.body.title}, function(err, animal){
    console.log(animal)
    if(err) {
      console.log(err);
      res.render("animals/new");
    }
    else {
      db.zoo.findById(req.params.author_id,function(err,zoo){
        zoo.animals.push(animal);
        animal.zoo = zoo._id;
        animal.save();
        zoo.save();
        res.redirect("/zoos/"+ req.params.author_id +"/animals");
      });
    }
  });
});

// SHOW
app.get('/zoos/:zoo_id/animals/:id', function(req,res){
  db.animal.findById(req.params.id)
    .populate('zoo')
    .exec(function(err,animal){
      console.log(animal.zoo)
      res.render("animals/show", {animal:animal});
    });
});

// EDIT
app.get('/zoos/:zoo_id/animals/:id/edit', function(req,res){
  db.animal.findById(req.params.id)
    .populate('zoo')
    .exec(function(err,animal){
      res.render("animals/edit", {animal:animal});
    });
});

// UPDATE
app.put('/zoos/:zoo_id/animals/:id', function(req,res){
 db.animal.findByIdAndUpdate(req.params.id, {title:req.body.title},
     function (err, animal) {
       if(err) {  
         res.render("animals/edit");
       }
       else {
         res.redirect("/zoos/" + req.params.author_id + "/animals");
       }
     });
});

// DESTROY
app.delete('/zoos/:zoo_id/animals/:id', function(req,res){
 db.animal.findByIdAndRemove(req.params.id, {title:req.body.title},
      function (err, animal) {
        if(err) {
          console.log(err);
          res.render("animals/edit");
        }
        else {
          res.redirect("/zoos/" + req.params.author_id + "/animals");
        }
      });
});

// CATCH ALL
app.get('*', function(req,res){
  res.render('404');
});

// START SERVER
app.listen(3000, function(){
  "Server is listening on port 3000";
});