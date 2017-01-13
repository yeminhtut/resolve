(function() {
  'use strict';

  angular
    .module('resolveApp')
    .factory('Api', Api) 

    Api.$inject= ['$http', '$httpParamSerializer','$stateParams']
    function Api($http, parmaSerialize,$stateParams){
     const base= 'https://magdev.tripzilla.com/wp-json/wp/v2/';

     return {
        testingApi: function() {
          var test_str = 'return from api';
          return test_str;
        },
        getArticles: function() {
          return $http.get(base + 'posts?per_page=12')
                .then(function (res) { return res; }, 
                  function(err) { return err; });
        },
        getSingleArticle: function(id) {
          return $http.get(base + 'posts/'+id)
                .then(function (res) { return res; }, 
                  function(err) { return err; });
        },
     }
     
    }
})()