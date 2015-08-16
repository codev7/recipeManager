'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Recipe = mongoose.model('Recipe'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, recipe;

/**
 * Recipe routes tests
 */
describe('Recipe CRUD tests', function() {
	before(function(done) {
		// Get application
		app = express.init(mongoose);
		agent = request.agent(app);

		done();
	});

	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new recipe
		user.save(function() {
			recipe = {
				title: 'Recipe Title',
				content: 'Recipe Content'
			};

			done();
		});
	});

	it('should be able to save an recipe if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new recipe
				agent.post('/api/recipes')
					.send(recipe)
					.expect(200)
					.end(function(recipeSaveErr, recipeSaveRes) {
						// Handle recipe save error
						if (recipeSaveErr) done(recipeSaveErr);

						// Get a list of recipes
						agent.get('/api/recipes')
							.end(function(recipesGetErr, recipesGetRes) {
								// Handle recipe save error
								if (recipesGetErr) done(recipesGetErr);

								// Get recipes list
								var recipes = recipesGetRes.body;

								// Set assertions
								(recipes[0].user._id).should.equal(userId);
								(recipes[0].title).should.match('Recipe Title');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save an recipe if not logged in', function(done) {
		agent.post('/api/recipes')
			.send(recipe)
			.expect(403)
			.end(function(recipeSaveErr, recipeSaveRes) {
				// Call the assertion callback
				done(recipeSaveErr);
			});
	});

	it('should not be able to save an recipe if no title is provided', function(done) {
		// Invalidate title field
		recipe.title = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new recipe
				agent.post('/api/recipes')
					.send(recipe)
					.expect(400)
					.end(function(recipeSaveErr, recipeSaveRes) {
						// Set message assertion
						(recipeSaveRes.body.message).should.match('Title cannot be blank');

						// Handle recipe save error
						done(recipeSaveErr);
					});
			});
	});

	it('should be able to update an recipe if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new recipe
				agent.post('/api/recipes')
					.send(recipe)
					.expect(200)
					.end(function(recipeSaveErr, recipeSaveRes) {
						// Handle recipe save error
						if (recipeSaveErr) done(recipeSaveErr);

						// Update recipe title
						recipe.title = 'WHY YOU GOTTA BE SO MEAN?';

						// Update an existing recipe
						agent.put('/api/recipes/' + recipeSaveRes.body._id)
							.send(recipe)
							.expect(200)
							.end(function(recipeUpdateErr, recipeUpdateRes) {
								// Handle recipe update error
								if (recipeUpdateErr) done(recipeUpdateErr);

								// Set assertions
								(recipeUpdateRes.body._id).should.equal(recipeSaveRes.body._id);
								(recipeUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of recipes if not signed in', function(done) {
		// Create new recipe model instance
		var recipeObj = new Recipe(recipe);

		// Save the recipe
		recipeObj.save(function() {
			// Request recipes
			request(app).get('/api/recipes')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single recipe if not signed in', function(done) {
		// Create new recipe model instance
		var recipeObj = new Recipe(recipe);

		// Save the recipe
		recipeObj.save(function() {
			request(app).get('/api/recipes/' + recipeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('title', recipe.title);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete an recipe if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new recipe
				agent.post('/api/recipes')
					.send(recipe)
					.expect(200)
					.end(function(recipeSaveErr, recipeSaveRes) {
						// Handle recipe save error
						if (recipeSaveErr) done(recipeSaveErr);

						// Delete an existing recipe
						agent.delete('/api/recipes/' + recipeSaveRes.body._id)
							.send(recipe)
							.expect(200)
							.end(function(recipeDeleteErr, recipeDeleteRes) {
								// Handle recipe error error
								if (recipeDeleteErr) done(recipeDeleteErr);

								// Set assertions
								(recipeDeleteRes.body._id).should.equal(recipeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete an recipe if not signed in', function(done) {
		// Set recipe user
		recipe.user = user;

		// Create new recipe model instance
		var recipeObj = new Recipe(recipe);

		// Save the recipe
		recipeObj.save(function() {
			// Try deleting recipe
			request(app).delete('/api/recipes/' + recipeObj._id)
			.expect(403)
			.end(function(recipeDeleteErr, recipeDeleteRes) {
				// Set message assertion
				(recipeDeleteRes.body.message).should.match('User is not authorized');

				// Handle recipe error error
				done(recipeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Recipe.remove().exec();
		done();
	});
});
