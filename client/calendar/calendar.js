angular.module('onlineCalendar').controller("CalendarController", function($scope, $http, $mdDialog, $location, $window, 
  MaterialCalendarData){
    $scope.owner = $location.absUrl().substring($location.absUrl().lastIndexOf("/")+1);
    $http.get("/isAuth").then(function(response){
      $scope.isAuth = response.data;
    });
    $scope.selectedDate = null;
    $scope.firstDayOfWeek = 1;
    $scope.events = {};

    $scope.$on("changeEvents", function(event, args){
      refreshDays(new Date(args.startDate), new Date(args.endDate));
    });
    $scope.logOut = function($event){
      $http.get("/logout");
      $window.location.href  = "/";
    }
    $scope.setDirection = function(direction) {
      $scope.direction = direction;
    };
    $scope.dayClick = function(date) {
      var dayEvents = $scope.events[date];
      for(var i=0; i<dayEvents.length;i++){
        dayEvents[i].startDate = new Date(dayEvents[i].startDate);        
        dayEvents[i].endDate = new Date(dayEvents[i].endDate);
      }
      $mdDialog.show({
          controller: 'DialogController',
          templateUrl: '/client/dialog/event-list.html',
          parent: angular.element(document.body),
          targetEvent: null,
          locals:{
            dayEvents: dayEvents,
            action: "",
            event:{},
            date:date,
            isAuth:$scope.isAuth,
            owner:$scope.owner
          },
          clickOutsideToClose:true
        });
    };
    $scope.addEvent = function($event){
      $scope.action = "Add";
      $mdDialog.show({
          controller: 'DialogController',
          templateUrl: '/client/dialog/event-dialog.html',
          parent: angular.element(document.body),
          targetEvent: $event,
          clickOutsideToClose:true,
          locals:{
            action: $scope.action,
            event:{},
            dayEvents: [],
            isAuth:$scope.isAuth,
            date: null,
            owner:$scope.owner
          }
        });
    };
    $scope.shareCalendar = function($event){
      $mdDialog.show({
         controller: 'DialogController',
          templateUrl: '/client/dialog/share-calendar.html',
          parent: angular.element(document.body),
          targetEvent: $event,
          clickOutsideToClose:true,
          locals:{
            action: null,
            event:{},
            dayEvents: [],
            date: null,
            isAuth:$scope.isAuth,
            owner:$scope.owner
          }
        });
    }
    $scope.setDayContent = function(date) {
      return getContentForDate(date).then(function(result){
        return result.content;
      })
    };
    function refreshDays(start, end){
      start.setHours(0,0,0,0);
      while(start < end){
        getContentForDate(start).then(function(result){
          var content = result.content;
          if(content ==""){
            content="<font color='#ffffff'>.</font>";
          }
          MaterialCalendarData.setDayContent(result.date, content);
        });
        start.setDate(start.getDate()+1);
      }
    }    
    function getContentForDate(date){
      return $http.get("/events/"+$scope.owner+"/"+date).
        then(function(response){
          var responseDate = new Date(response.data.date);
          $scope.events[responseDate] = [];         
          var content = "";
          var events = response.data.events;
          if(events && events.length > 0){
            if(responseDate < new Date()-1){
              content+="<font color='light-gray'>";
            }
            content += "<p><ul>";
            for(i=0;i<events.length;i++){
              content+="<li>"+events[i].name+"</li>";
              $scope.events[responseDate].push(events[i]);
            }  
            content+="</ul></p>";
            if(responseDate < new Date()-1){
              content+="</font>";
            }
          }          
          return {content : content, date : responseDate};
        }, function(err){
            console.log("Err "+err);
        });
    }
  });