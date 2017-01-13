(function() {
  'use strict';
  angular.module('resolveApp')
    .config(function ($stateProvider) {
      $stateProvider
        .state('article', {
          url: '/article/:slug/:id',
          templateUrl: 'client/app/article/article.html',
          controllerAs: 'vm',
          controller: 'ArticleCtrl',
          data: {
              meta: {
                'title': 'Single Article',
                'description': 'Single page description'
              }
            }
        })
    })
    .run(function(ngMeta) {
        ngMeta.init();
    });
})()