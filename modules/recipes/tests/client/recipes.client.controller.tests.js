'use strict';

(function() {
	// Recipes Controller Spec
	describe('RecipesController', function() {
		// Initialize global variables
		var RecipesController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Recipes controller.
			RecipesController = $controller('RecipesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one recipe object fetched from XHR', inject(function(Recipes) {
			// Create sample recipe using the Recipes service
			var sampleRecipe = new Recipes({
				title: 'An Recipe about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample recipes array that includes the new recipe
			var sampleRecipes = [sampleRecipe];

			// Set GET response
			$httpBackend.expectGET('api/recipes').respond(sampleRecipes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.recipes).toEqualData(sampleRecipes);
		}));

		it('$scope.findOne() should create an array with one recipe object fetched from XHR using a recipeId URL parameter', inject(function(Recipes) {
			// Define a sample recipe object
			var sampleRecipe = new Recipes({
				title: 'An Recipe about MEAN',
				content: 'MEAN rocks!'
			});

			// Set the URL parameter
			$stateParams.recipeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/recipes\/([0-9a-fA-F]{24})$/).respond(sampleRecipe);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.recipe).toEqualData(sampleRecipe);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Recipes) {
			// Create a sample recipe object
			var sampleRecipePostData = new Recipes({
				title: 'An Recipe about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample recipe response
			var sampleRecipeResponse = new Recipes({
				_id: '525cf20451979dea2c000001',
				title: 'An Recipe about MEAN',
				content: 'MEAN rocks!'
			});

			// Fixture mock form input values
			scope.title = 'An Recipe about MEAN';
			scope.content = 'MEAN rocks!';

			// Set POST response
			$httpBackend.expectPOST('api/recipes', sampleRecipePostData).respond(sampleRecipeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.title).toEqual('');
			expect(scope.content).toEqual('');

			// Test URL redirection after the recipe was created
			expect($location.path()).toBe('/recipes/' + sampleRecipeResponse._id);
		}));

		it('$scope.update() should update a valid recipe', inject(function(Recipes) {
			// Define a sample recipe put data
			var sampleRecipePutData = new Recipes({
				_id: '525cf20451979dea2c000001',
				title: 'An Recipe about MEAN',
				content: 'MEAN Rocks!'
			});

			// Mock recipe in scope
			scope.recipe = sampleRecipePutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/recipes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/recipes/' + sampleRecipePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid recipeId and remove the recipe from the scope', inject(function(Recipes) {
			// Create new recipe object
			var sampleRecipe = new Recipes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new recipes array and include the recipe
			scope.recipes = [sampleRecipe];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/recipes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRecipe);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.recipes.length).toBe(0);
		}));
	});
}());
