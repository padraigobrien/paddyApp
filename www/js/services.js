angular.module('starter.services', ['ngResource'])
  .factory('Experience', function($resource){
    retrieve : function() {
      return $resource('http://ec2-52-18-117-178.eu-west-1.compute.amazonaws.com:8080/experiences/:id',
        {id: "@id"}
      )
    }
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
 .factory('myBookings', function($resource){
    return $resource('http://ec2-52-18-117-178.eu-west-1.compute.amazonaws.com:8080/bookings/:userId',
      {userID : "@userID"}
    )
  })

