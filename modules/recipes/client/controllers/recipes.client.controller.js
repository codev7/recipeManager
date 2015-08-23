'use strict';

angular.module('recipes').controller('RecipesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Recipes','Upload','$http',
	function($scope, $stateParams, $location, Authentication, Recipes, Upload, $http) {
		$scope.authentication = Authentication;

		/*$scope.$watch('file', function (file) {
			$scope.upload($scope.file);
		});

		$scope.upload = function (file) {
			console.log(file);
			Upload.upload({
				url: 'http://localhost:3000/img',
				fields: {'username': $scope.username},
				file: file
			}).progress(function (evt) {

			}).success(function (data, status, headers, config) {
				alert('ok');
				console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
			}).error(function (data, status, headers, config) {
				console.log('error status: ' + status);
			});
		};*/

		$scope.create = function() {
			var newimgurl='';
			var title= this.title;
			var	content= this.content;
			var	content1= this.content1;
			var	content2= this.content2;
			var	content3= this.content3;
			var	rspan = this.rspan;
			var	cspan = this.cspan;
	if(this.picFile){
			var image=this.picFile;
			if (angular.isArray(image)) {
				image = image[0];
			}
			newimgurl = 'img/'+image.name;
			// This is how I handle file types in client side
			if (image.type !== 'image/png' && image.type !== 'image/jpeg') {
				alert('Only PNG and JPEG are accepted.');
				return;
			}

			console.log(image);

			Upload.upload({
				url: '/uploads',
				method: 'POST',
				headers: {
					'Content-Type': image.type
				},
				file: image
			}).success(function(data, status, headers, config) {
				console.log(data);
				newimgurl=data.newpath;
//				$scope.imgurl = data.newpath;

				console.log(newimgurl);

			}).error(function(err) {
				console.log('Error uploading file: ' + err.message || err);
			});

	}
			var recipe = new Recipes({
				title: title,
				content: content,
				rspan:rspan,
				cspan:cspan,
				url:newimgurl,
				content1: content1,
				content2: content2,
				content3: content3
			});

			recipe.$save(function(response) {
				$location.path('/recipes/' + response._id);
				$scope.title = '';
				$scope.content = '';
				$scope.content1 = '';
				$scope.content2 = '';
				$scope.content3 = '';
				$scope.rspan = 1;
				$scope.cspan = 1;
				$scope.url = '';
			}, function(errorResponse) {
				alert('please input only number in Span Field');
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(recipe) {
			if (recipe) {
				recipe.$remove();

				for (var i in $scope.recipes) {
					if ($scope.recipes[i] === recipe) {
						$scope.recipes.splice(i, 1);
					}
				}
			} else {
				$scope.recipe.$remove(function() {
					$location.path('recipes');
				});
			}
		};

		$scope.update = function() {
			var recipe = $scope.recipe;
			recipe.$update(function() {
				$location.path('recipes/' + recipe._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.recipes = Recipes.query();
		};

		$scope.findOne = function() {
			$scope.recipe = Recipes.get({
				recipeId: $stateParams.recipeId
			});
		};
	}
]);
