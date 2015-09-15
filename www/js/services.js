angular.module('starter.services', ['ngResource'])
  .factory('Experience', function($resource){
    return $resource('http://localhost:8080/experiences')
  });
