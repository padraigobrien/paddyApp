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
.controller('LoginCtrl', function($scope, $state, $ionicModal,$timeout,ngFB, Profile){
    $scope.fbLogin = function () {
      ngFB.login({scope: 'email, publish_actions' }).then(
        function (response) {
          if (response.status === 'connected') {
            console.log('Facebook login succeeded');
            getInfo();
            $state.go('app.experiences');
          } else {
            alert('Facebook login failed');
          }
        });
    };

    getInfo = function() {
      ngFB.api({path: '/me'}).then(
        function(user) {
          console.log(JSON.stringify(user));
          Profile.setFacebookId(user.id);
          Profile.setFacebookName(user.name);
          console.log("set facebookid:" + Profile.getFacebookId())
        },
        errorHandler);
    }

    function errorHandler(error) {
      console.log(error.message);
    }
})
.controller('AppCtrl', function ($scope, $ionicModal, $timeout, ngFB) {

})

.controller('ProfileCtrl', function ($scope, ngFB, Profile) {
    $scope.name= Profile.getFacebookName();
    $scope.id = Profile.getFacebookId();
  })

.controller('ExperienceCtrl', function($scope, $state, $ionicLoading,  Experiences, Booking){

    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    $scope.whenthereareresults=false;

    cardTypes = Experiences.query(function(cardArray){
      for(var i = 0; i < cardArray.length; i++) {
        $scope.addCard(i);
      }
    });
    $scope.cards = [];

    $scope.addCard = function(i) {
      var newCard = cardTypes[i];
      $scope.cards.push(angular.extend({}, newCard));
    }

    $ionicLoading.hide();

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

.controller('BookingCtrl', function($scope, $ionicPopup, $filter, $state, $http, $ionicLoading, Experiences,Booking){

    $scope.name = Booking.getGuideName();
    $scope.title = Booking.getTitle();
    $scope.mobileNumber = Booking.getMobileNumber();
    $scope.price = Booking.getPrice();
    $scope.experienceID = Booking.getBookingId();
    $scope.image = Booking.getImage();
    $scope.message = "";

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
        $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
        });

        var timestamp=Date.parse($scope.date);
        var datelength=0;
        datelength = $scope.date.length;

        if (isNaN(timestamp)===false) {
          if (result.error) {
            $scope.message = 'Payment failed! error: ' + result.error.message;
            console.log('Payment failed! error: ' + result.error.message)
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
                myUserId: "10153023161040925",
                experienceDate: $scope.date,
                guideName: $scope.name,
                guideContactNumber: $scope.mobileNumber.toString(),
                experienceTitle: $scope.title,
                experiencePrice: $scope.price,
                experienceID: Number(new Date()),
                image: $scope.image
              })
            };
            $http(req).then(function (response) {
              $scope.message = response.status;
              console.log(response.status)
            });
            $ionicLoading.hide();
            $state.go('app.myExperiences');
          }
        }
        else {
          $ionicLoading.hide();
          $scope.message = "Date does not look like it was filled in";
        }
      }
  }})

.controller('MyExperiencesCtrl', function($scope, $state, $ionicLoading, Bookings, Profile) {

    console.log("loading my experiences");
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

      UserID = Profile.getFacebookId();
      console.log("refreshing");

      if(UserID===""){
        console.log("You need to log in");
        $scope.$broadcast('scroll.refreshComplete');
        $ionicLoading.hide();
        return;
      }
      cardTypes =Bookings.query({UserID: UserID},
        function(cardArray){
          for(var i = 0; i < cardArray.length; i++) {
            $scope.addCard(i);
          }
      });
      $scope.items = [];
      $scope.addCard = function(i) {
        var newCard = cardTypes[i];
        $scope.items.push(angular.extend({}, newCard));
      };
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');



  });
