(function(){
	'use strict',

	angular
		.module('resolveApp')
		.controller('MainCtrl', main)

	main.$inject= ['$scope', '$http']
	function main($scope, $http){
		var vm= this;
		vm.articles = [];
		vm.title = "Main Template"
		// init()

		// function init() {
		// 	getAllArticles()
		// }

		// function getAllArticles() {
		// 	api.getArticles()
		// 	.then(function(res) {
		// 		vm.articles= res.docs
		// 		console.log(vm.articles)
		// 	})
		// 	.catch(function() {
		// 		console.warn("Error in get all articles.")
		// 	})
		// }

		function goToHome(){
			$location.path('/');
		}
	}
})()