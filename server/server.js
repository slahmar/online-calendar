var express = require("express");
var path = require("path");
var events = require("./events.js");
var calendar = require("./calendar.js");
var mongoose = require('mongoose');
var session = require('express-session');

mongoose.connect('mongodb://localhost/calendar');

var app = express();
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));

//////// AUTHENTIFICATION FUNCTIONS ////////
var auth = function(req, res, next) {
  var email = req.session.email;
  if (req.session && req.session.email && req.session.admin)
    return next();
  else{
    return res.sendStatus(401);
  }    
};

app.get("/isAuth", function(req, res){
  if(req.session && req.session.email && req.session.admin){
    res.json(true);
  }
  else{
    res.json(false);
  }
});

app.get("/login/:email", function(req, res){
  var email = req.params.email;
  console.log(email);
  calendar.login(email, function(response){
    if(response){      
      req.session.email = email;
      req.session.admin = true;
      res.json(response);      
    }   
  });
});

app.get("/logout", function(req, res){
  req.session.destroy();
});

app.post("/signup/:email", function(req, res){
  var email = req.params.email;
  calendar.create(email, function(response){
    if(response){
      req.session.email = email;
      req.session.admin = true;
    }
    res.json(response);  
  });
});

/////// GET CALENDAR //////////

app.get("/calendar/:email", function(req, res){
  res.sendFile(path.resolve('./client/calendar/calendar.html'));
});

/////// EVENTS FUNCTIONS ///////////
app.get("/events/:owner/:date", function(req, res){
  var owner = req.params.owner;
  var date = new Date(req.params.date);
  events.findByDate(owner, date, function(events){
    res.json({events : events, date: date});
  });
});

app.get("/search/:owner/:name", function(req, res){
  var name = req.params.name;
  var owner = req.params.owner;
  events.findByName(owner, name, function(events){
    res.json(events)
  });
})

app.post("/events/:owner/:name/:startDate/:endDate", auth, function(req, res) {
  var owner = req.params.owner;
  var name = req.params.name;
  var startDate = req.params.startDate;
  var endDate = req.params.endDate;
  events.create(owner, name, startDate, endDate, function(response){
      res.json(response);
  });
});

app.put("/events/:id/:name/:startDate/:endDate", auth, function(req, res) {
  events.update(req.params.id, req.params.name, req.params.startDate, req.params.endDate, function(response){
    res.json(response);
  });
});

app.delete("/events/:id", auth, function(req, res){
  events.remove(req.params.id, function(response){
    res.json(response);
  });
});

///////// CONFIGURATION ///////////////

app.use('/client',express.static(path.resolve('./client')));
app.use('/node_modules',express.static(path.resolve('./node_modules')));

app.get('/', function(req, res){
  res.sendFile(path.resolve('./client/login/login.html'));
});

//////// START SERVER /////////////////
var server = app.listen(8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});
