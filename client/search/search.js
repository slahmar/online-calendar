angular.module('onlineCalendar').controller("SearchController", function($http, $mdDialog, $location){
  var owner = $location.absUrl().substring($location.absUrl().lastIndexOf("/")+1);
  this.selectedItemChange = selectedItemChange;

  this.querySearch = function(query){
    return $http.get("/search/"+owner+"/"+query)
        .then(function(response){
          return response.data;
        })
  }

  function selectedItemChange(item) {
    var event = {name:item.name, startDate:new Date(item.startDate), endDate:new Date(item.endDate)};
    $http.get("/isAuth").then(function(response){
      $mdDialog.show({
        controller: 'DialogController',
        templateUrl: '/client/dialog/event-dialog.html',
        parent: angular.element(document.body),
        targetEvent: null,
        clickOutsideToClose:true,
        locals:{
          action: 'View',
          event:event,
          owner:owner,
          isAuth : response.data,
          dayEvents:[],
          date: null
        }
      });
    });    
  }
});
