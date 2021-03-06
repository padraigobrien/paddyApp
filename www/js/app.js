// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngOpenFB','ngMessages'])

.run(function($ionicPlatform, ngFB) {
    ngFB.init({appId: '1637677799812553'});
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  window.Stripe.setPublishableKey('pk_test_HPEKBl7nQOepDTNYKb2YHPxW');

  $stateProvider
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
    .state('app.experiences', {
      url: '/experiences',
      views: {
        'menuContent': {
          templateUrl: 'templates/experiences.html',
          controller: 'ExperienceCtrl'
        }
      }
    })
    .state('app.booking', {
      url: '/booking',
      views: {
        'menuContent': {
          templateUrl: 'templates/booking.html',
          controller: 'BookingCtrl'
        }
      }
    })
    .state('app.profile', {
      url: "/profile",
      views: {
        'menuContent': {
          templateUrl: "templates/profile.html",
          controller: "ProfileCtrl"
        }
      }
    })
    .state('app.myExperiences', {
      url: "/myexperiences",
      views: {
        'menuContent': {
          templateUrl: "templates/myExperiences.html",
          controller: "MyExperiencesCtrl"
        }
      }
    })
    .state('app.login', {
      url: "/login",
      views: {
        'menuContent': {
          templateUrl: "templates/login.html",
          controller: "LoginCtrl"
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');
});
