angular.module('starter.controllers', ['starter.services','ngOpenFB','gajus.swing'])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, ngFB) {


  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

    $scope.fbLogin = function () {
      ngFB.login({scope: 'email, publish_actions' }).then(
        function (response) {
          if (response.status === 'connected') {
            console.log('Facebook login succeeded');
            $scope.closeLogin();
          } else {
            alert('Facebook login failed');
          }
        });
    };
})

  .controller('ProfileCtrl', function ($scope, ngFB) {
    ngFB.api({
      path: '/me',
      params: {fields: 'id,name'}
    }).then(
      function (user) {
        $scope.user = user;
      },
      function (error) {
        alert('Facebook error: ' + error.error_description);
      });
  })


.controller('ExperienceCtrl', function($scope, Experience){

    var stack,
      cards;

    $scope.cards= Experience.query();

    $scope.isThrowOut = function (offset, elementWidth) {
      console.log("Podge")
      return $scope.throwOutConfidence(offset, elementWidth) == 1;
    };
    $scope.throwOutConfidence = function (offset, elementWidth) {
      console.log(Math.min(Math.abs(offset) / 30, 1));
      return Math.min(Math.abs(offset) / 30, 1);
    };

    $scope.throwout = function (eventName, eventObject) {
     // console.log('throwout', eventObject);
    };

    $scope.throwoutleft = function (eventName, eventObject) {
    //  console.log('throwoutleft', eventObject);
    };

    $scope.throwoutright = function (eventName, eventObject) {
    //  console.log('throwoutright', eventObject);
    };

    $scope.throwin = function (eventName, eventObject) {
   //   console.log('throwin', eventObject);
    };

    $scope.dragstart = function (eventName, eventObject) {
    //  console.log('dragstart', eventObject);
    };

    $scope.dragmove = function (eventName, eventObject) {
    //  console.log('dragmove', eventObject);
      if(eventObject.throwOutConfidence > 0.2) {

      }

    };

    $scope.dragend = function (eventName, eventObject) {

      //console.log('dragend', eventObject);
    };
});
