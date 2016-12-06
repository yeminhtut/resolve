(function(){
	'use strict',

	angular
		.module('resolveApp')
		.directive('editor', function() {
			return {
				restrict: 'A',
				templateUrl: 'directives/editor.html'
			}
		});
})()