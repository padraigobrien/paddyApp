angular.module('starter.controllers', ['starter.services','ngOpenFB', 'ionic.contrib.ui.tinderCards','ionic','ui.bootstrap.datetimepicker','angularPayments'])
.directive('noScroll', function() {
    return {
      restrict: 'A',
      link: function($scope, $element, $attr) {
        $element.on('touchmove', function(e) {
          e.preventDefault();
        });
      }
    }
  })

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

.controller('ExperienceCtrl', function($scope, $state, Experience, Booking){

    $scope.whenthereareresults=false;

    cardTypes = Experience.query(function(cardArray){
      for(var i = 0; i < cardArray.length; i++) {
        $scope.addCard(i);
      }
    });
    $scope.cards = [];

    $scope.addCard = function(i) {
      var newCard = cardTypes[i];
      $scope.cards.push(angular.extend({}, newCard));
    }

    $scope.cardSwipedLeft = function(index) {
      console.log('Left swipe');
    }

    $scope.cardSwipedRight = function(index) {
      $scope.whenthereareresults=true;

    }

    $scope.cardDestroyed = function(index) {
      $scope.cards.splice(index, 1);
    }

    $scope.book = function(cardId,GuideName,Title,mobileNumber,price,image) {

      Booking.setBookingId(cardId);
      Booking.setGuideName(GuideName);
      Booking.setTitle(Title);
      Booking.setMobileNunmber(mobileNumber);
      Booking.setPrice(price);
      Booking.setImage(image);
      $state.go('app.booking');
    }
})

.controller('BookingCtrl', function($scope, $ionicPopup, $filter, $state, $http, $ionicLoading, Experience,Booking){

    $scope.name = Booking.getGuideName();
    $scope.title = Booking.getTitle();
    $scope.mobileNumber = Booking.getMobileNumber();
    $scope.price = Booking.getPrice();
    $scope.experienceID = Booking.getBookingId();
    $scope.image = Booking.getImage();

    $scope.openDatePicker = function() {

      $scope.tmp = {};
      $scope.tmp.newDate = $scope.date;


      var bookingDatePopup = $ionicPopup.show({
        template: '<datetimepicker data-ng-model="date" data-before-render="beforeRender($view, $dates, $leftDate, $upDate, $rightDate)" data-on-set-time="onTimeSet(newDate)" data-datetimepicker-config="{ minView: \'hour\' }"></datetimepicker>',
        title: "Booking date",
        scope: $scope,
        buttons: [
          { text: 'Cancel' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              $scope.date = $scope.tmp.newDate;
            }
          }
        ]
      });

      $scope.beforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {
        var index = Math.floor(Math.random() * $dates.length);
        $dates[index].selectable = false;
      }

      $scope.onTimeSet = function (newDate) {
        $scope.date =$filter('date')(newDate, 'MMM dd yyyy HH:mm');
        bookingDatePopup.close();
      }

      $scope.stripeCallback = function (code, result) {

        if (result.error) {
          console.log('it failed! error: ' + result.error.message);
        } else {
          $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
          });
         console.log('success! token: ' + result.id);
          var req = {
            method: "PUT",
            url: "http://ec2-52-18-117-178.eu-west-1.compute.amazonaws.com:8080/bookings",
            headers: {
              'Content-Type': "application/json"
            },
              data: JSON.stringify({
                  myUserId : "10153023161040925",
                  experienceDate: $scope.date,
                  guideName: $scope.name,
                  guideContactNumber:$scope.mobileNumber.toString(),
                  experienceTitle:$scope.title,
                  experiencePrice:$scope.price,
                  experienceID:  Number(new Date()),
                  image: $scope.image
                })
          };
          $http(req).then(function(response){
            console.log(response.status);
          });
          $ionicLoading.hide();
          $state.go('app.myExperiences');
        }
      };
  }})

.controller('MyExperiencesCtrl', function($scope, $state, myBookings) {

    cardTypes = myBookings.query({},{'UserID': "10153023161040925"},
    function(cardArray){
      for(var i = 0; i < cardArray.length; i++) {
        $scope.addCard(i);
      }
    });

    $scope.items = [];
    $scope.addCard = function(i) {
      var newCard = cardTypes[i];
      $scope.items.push(angular.extend({}, newCard));
    }

  });
