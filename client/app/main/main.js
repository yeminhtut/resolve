(function() {
  'use strict';
  angular.module('resolveApp')
    .config(function ($stateProvider) {
      $stateProvider
        .state('main', {
          url: '/',
          templateUrl: 'client/app/main/main.html',
          controllerAs: 'vm',
          controller: 'MainCtrl',
          data: {
              meta: {
                'title': 'Home page',
                'description': 'Home page description'
              }
            }
        })
    })
    .run(function(ngMeta) {
        ngMeta.init();
    });
})()