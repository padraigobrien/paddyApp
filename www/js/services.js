angular.module('starter.services', ['ngResource'])
  .factory('Experience', function($resource){
    return $resource('http://ec2-52-18-117-178.eu-west-1.compute.amazonaws.com:5000/experiences')
  });
