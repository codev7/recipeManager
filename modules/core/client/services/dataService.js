'use strict';
angular.module('core').service('usersService', ['$q',
    function($q) {


        /**
         * Users DataService
         * Uses embedded, hard-coded data model; acts asynchronously to simulate
         * remote data service call(s).
         *
         * @returns {{loadAll: Function}}
         * @constructor
         */

        var users = [
            {
                title: 'Ready to Bake',
                img: './img/item1.png',
                author: 'by Viktor Hanacek',
                span:{row:1,col:1}
            },
            {
                title: 'Perfect Italian Pizza',
                img: './img/item1.png',
                author: 'by Jakub K.',
                span:{row:1,col:1}
            },
            {
                title: 'The Best Chocolate Cake Ever',
                img: './img/item3.png',
                author: 'by Mitchell Millsaps',
                span:{row:1,col:2}
            },
            {
                title: 'The Perfect Milkshake',
                img: './img/item1.png',
                author: 'by Viktor Hanacek',
                span:{row:1,col:1}

            },
            {
                title: 'Homemade Burger',
                img: './img/item2.png',
                author: 'by Jakub K.',
                span:{row:2,col:1}
            },
            {
                title: 'Morning Musli',
                img: './img/item1.png',
                author: 'by Viktor Hanacek',
                span:{row:1,col:1}
            }
        ];

        // Promise-based API
        return {
            loadAll : function() {
                // Simulate async nature of real remote calls
                return $q.when(users);
            }
        };
    }]);

angular.module('core').factory('Recipes', ['$resource',
    function($resource) {
        return $resource('api/recipes/:recipeId', {
            recipeId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });

    }
]);
