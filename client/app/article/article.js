(function() {
  'use strict';
  angular.module('resolveApp')
    .config(function ($stateProvider) {
      $stateProvider
        .state('article', {
          url: '/article',
          templateUrl: 'client/app/article/article.html',
          controllerAs: 'vm',
          controller: 'ArticleCtrl'
        })
    });
})()