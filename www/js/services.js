angular.module('starter.services', ['ngResource'])
  .factory('Experience', function($resource){
    return $resource('http://localhost:8080/experiences/:id',
      {id: "@id" }
    )
  })
  .service('Booking', function () {
    var BookingId = 0;
    var guideName ="";
    var title="";
    var mobileNumber="";
    var price=0;

    return {
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
      }
    };
  })
