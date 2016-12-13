var mongoose = require('mongoose');

var calendarSchema = mongoose.Schema({
    email: { type:String, unique:true}
});
var Calendar = mongoose.model('Calendar', calendarSchema);

var login = function(email, callback){
  var query = Calendar.find({ email: email});
  query.exec(function(err, calendar){
    if(err) return console.error(err);
    if(calendar && calendar.length > 0){
      callback(calendar[0]._id);
    }
    else{
      callback();
    }        
  });
}

var create = function(email, callback){
  var calendar = new Calendar({ email:email});
  calendar.save(function (err, calendar) {
    if (err) callback();
    else if(calendar && calendar._id){
      callback(calendar._id);    
    }
    else{
      callback();
    }    
  });
}

module.exports.login = login;
module.exports.create = create;
