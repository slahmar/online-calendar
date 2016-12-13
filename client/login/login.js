angular.module('onlineCalendar').controller("LoginController", function($scope, $routeParams, $http, $window){
    $scope.message = $routeParams.message;
    $scope.login = function(){
        $http.get("/login/"+$scope.signin).then(function(response){
            if(response && response.data){
                $window.location.href = '/calendar/'+response.data;
            }
            else{
                $scope.loginAlert = 'No account for this email.';
            }
        });
    }
    $scope.signUp = function(){
        $http.post("/signup/"+$scope.signup).then(function(response){
            if(response && response.data){
                $window.location.href = '/calendar/'+response.data;
            }
            else{
                $scope.signUpAlert = "This account already exists. Please login.";
            }
        });
    }
});
