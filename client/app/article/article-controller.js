(function(){
	'use strict',

	angular
		.module('resolveApp')
		.controller('ArticleCtrl', article)

	article.$inject= ['$scope', 'Api', '$http','$localStorage','$stateParams']
	function article($scope, api, $http,$localStorage,$stateParams){
		var vm= this;
		vm.article = [];
		vm.title = "Article Template";
		vm.id = $stateParams.id;
		vm.saveArticle = saveArticle;
		init()

		function init() {
			getSingleArticle(vm.id);
		}

		function getSingleArticle(id) {
			api.getSingleArticle(id)
			.then(function(res) {
				//console.log(res);
				vm.article= res.data
				console.log(vm.article)
			})
			.catch(function() {
				console.warn("Error in get all articles.")
			})
		}

		function saveArticle(){
			localStorageService.set('editingArticle', vm.article);
		}

		function goToHome(){
			$location.path('/');
		}
	}
})()