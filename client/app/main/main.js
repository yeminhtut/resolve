(function() {
  'use strict';
  angular.module('resolveApp')
    .config(function ($stateProvider) {
      $stateProvider
        .state('main', {
          url: '/',
          templateUrl: 'app/main/main.html',
          controllerAs: 'vm',
          controller: 'MainCtrl'
        })
    });
})()