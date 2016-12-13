var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
    name: String, 
    startDate : Date, 
    endDate : Date,
    owner: String
});

var Event = mongoose.model('Event', eventSchema);

var findByDate = function(id, dateStartDay, callback){
    var dateEndDay = new Date(dateStartDay);
    dateEndDay.setHours(23);
    dateEndDay.setMinutes(59);
    var query = Event.find({
        $or : [
            {$and : [{startDate : {$lte: dateStartDay}}, {endDate : {$gte:dateStartDay}}]}, 
            {$and : [{startDate : {$gte: dateStartDay}}, {startDate : {$lte:dateEndDay}}]}
        ], 
        owner: id
    });
    query.exec(function(err, events){
        if(err) return console.error(err);
        console.log(events);
        callback(events);
    });
}

var findByName = function(id, name, callback){
    var query = Event.find({ name: { "$regex": name, "$options": "i" }, owner:id});
    query.exec(function(err, events){
        if(err) return console.error(err);
        callback(events);
    });
}

var create = function(id, name, startDate, endDate, callback){
    var event = new Event({ owner:id, name : name, startDate : startDate, endDate : endDate});
    event.save(function (err) {
      if (err) callback(false);
      callback(true);
    });

}

var update = function(id, newName, newStartDate, newEndDate, callback){
    Event.update({_id : id}, {name : newName, startDate: newStartDate, endDate:newEndDate}, function(err, numAffected) {
        if(numAffected == 1){
            callback(true);
        }
        else{
            callback(false);
        }
    });
}

var remove = function(id, callback){
    Event.findById(id).remove(function (err) {
      if (err) callback(false);
      callback(true);
    });
}

module.exports.create = create;
module.exports.update = update;
module.exports.remove = remove;
module.exports.findByDate = findByDate;
module.exports.findByName = findByName;
