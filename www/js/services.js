angular.module('starter.services', ['ngResource'])
.factory('Experiences', function($resource){
  return $resource('http://localhost:8080/experiences/:id',
    {id: "@id" }
  )
})
.factory('Bookings', function($resource){
    return $resource('http://localhost:8080/bookings/:UserID', {
      UserID : '@UserID'
    });
  })
.service('Booking', function () {
  var facebookId=0;
  var BookingId = 0;
  var guideName ="";
  var title="";
  var mobileNumber="";
  var price=0;
  var image="";

  return {
    getFacebookId: function () {
      return facebookId;
    },
    setFacebookId: function(value) {
      facebookId = value;
    },
    getBookingId: function () {
      return BookingId;
    },
    setBookingId: function(value) {
      BookingId = value;
    },
    getGuideName: function() {
      return guideName;
    },
    setGuideName: function(value) {
      guideName = value;
    },
    getTitle: function() {
      return title;
    },
    setTitle: function(value) {
      title = value;
    },
    getMobileNumber: function() {
      return mobileNumber;
    },
    setMobileNunmber: function(value) {
      mobileNumber = value;
    },
    getPrice: function() {
      return price;
    },
    setPrice: function(value) {
      price = value;
    },
    getImage: function() {
      return image;
    },
    setImage: function(value) {
      image = value;
    }
  };
})
.service('Profile', function(){
  var Id="";
  var name=""
    return {
      getFacebookId: function () {
        return Id;
      },
      setFacebookId: function (value) {
        Id = value;
      },
      getFacebookName: function () {
        return name;
      },
      setFacebookName: function (value) {
        name = value;
      }
    }
})
