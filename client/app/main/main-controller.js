(function(){
	'use strict',

	angular
		.module('resolveApp')
		.controller('MainCtrl', main)

	main.$inject= ['$scope', 'Api', '$http','$localStorage']
	function main($scope, api, $http,$localStorage){
		var vm= this;
		vm.title = 'Main Template';
		vm.articles = [];
		vm.assignment = [];
		vm.saveAssignment = saveAssignment;
		vm.storage = $localStorage;
		init();

		function init() {
			getAllArticles();
			// testingApi();
		}

		function testingApi(){
			var check = api.testingApi();
			//console.log(check);
		}

		function getAllArticles() {
			api.getArticles()
			.then(function(res) {
				vm.articles= res.data;
				console.log(vm.articles)
			})
			.catch(function() {
				console.warn("Error in get all articles.")
			})
		}

		function goToHome(){
			$location.path('/');
		}

		function saveAssignment(){
			// console.log("it start");
			// console.log(vm.assignment);
			// console.log(vm.storage);
			vm.storage.assignment = vm.assignment;
	        console.log(vm.storage.assignment);
	        // $scope.saveSection = saveSection();
		}
	}
})()