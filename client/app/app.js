angular.module("resolveApp",[])
	.controller('mainCtrl',main);

main.$inject= ['$scope']
function main($scope){
	var vm = this;
	$scope.title = 'Sample Title';
}