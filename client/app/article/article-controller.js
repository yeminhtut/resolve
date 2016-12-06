(function(){
	'use strict',

	angular
		.module('resolveApp')
		.controller('ArticleCtrl', article)

	article.$inject= ['$scope', '$http','localStorageService']
	function article($scope, $http,localStorageService){
		var vm= this;
		vm.articles = [];
		vm.title = "Article Template"
		vm.saveArticle = saveArticle;
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

		function saveArticle(){
			localStorageService.set('editingArticle', vm.article);
			//console.log(vm.article);
		}

		function goToHome(){
			$location.path('/');
		}
	}
})()