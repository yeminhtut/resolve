angular.module('resolveApp', [
		'ui.router',
		'angular-medium-editor',
		'ngMaterial',
		'LocalStorageModule'
	])
.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  })

	