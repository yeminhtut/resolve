(function() {
  'use strict';

  angular
    .module('resolveApp')
    .factory('Api', Api) 

    Api.$inject= ['$http', '$httpParamSerializer']
    function Api($http, parmaSerialize){
     const base= 'http://localhost:3000/';

     return {
        getArticles: function() {
          return $http.get(base + 'client/articles.json')
                .then(function (res) { return res.data; }, 
                  function(err) { return err; });
        },
     }
     
    }
})()