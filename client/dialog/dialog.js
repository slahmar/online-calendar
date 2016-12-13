angular.module('onlineCalendar').controller("DialogController", function($scope, $mdDialog, $rootScope, $http, $location, $window, 
    action, event, dayEvents, date, owner, isAuth) {
    $scope.action = action;
    $scope.dayEvents = dayEvents;
    $scope.date = date;
    $scope.event = event;
    $scope.owner = owner;
    $scope.shareUrl = $location.absUrl();
    $scope.isAuth = isAuth;
    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.save = function(){
        var name = event.name;
        var startDate = getDateTime(event.startDate, event.startHour);
        var endDate = getDateTime(event.endDate, event.endHour);
        $http.post(encodeURI("/events/"+$scope.owner+"/"+name+"/"+startDate+"/"+endDate)).then(function(response){
          if(response){
            var args = {startDate:startDate, endDate:endDate};
            $rootScope.$broadcast('changeEvents', args);
          }          
        });
        $mdDialog.cancel();
    }

    $scope.updateEvent = function(event){
        var startDate = getDateTime(event.startDate, event.startHour);
        var endDate = getDateTime(event.endDate, event.endHour);
        $http.put(encodeURI("/events/"+event._id+"/"+event.name+"/"+startDate+"/"+endDate)).then(function(response){
          if(response && response.data){
              var args = {startDate:startDate, endDate:endDate};
              $rootScope.$broadcast('changeEvents', args);
            }   
        });
        $mdDialog.cancel();
    };

    $scope.deleteEvent = function(event){
        $scope.confirm = false;
        $http.delete("/events/"+event._id).then(function(response){
          if(response && response.data){
            var args = {startDate:event.startDate, endDate:event.endDate};
            $rootScope.$broadcast('changeEvents', args);
          }          
        });
        $scope.dayEvents.splice(event, 1);
        if($scope.dayEvents.length == 0){
          $mdDialog.cancel();
        }
    }

    $scope.shareByEmail = function(){
        $window.location = "mailto:example@domain.com?subject=OnlineCalendar&body=Check my calendar here : "+$scope.shareUrl;
    }

    function getDateTime(date, time){
        var date = new Date(date);
        if(time){
          var time = new Date(time);
          date.setHours(time.getHours());
          date.setMinutes(time.getMinutes());
        }        
        return date;
    }
});