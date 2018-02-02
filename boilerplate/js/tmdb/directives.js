/*
Tout comme les posts, on crée une directive pour une miniature d'un film ainsi qu'une
directive pour le film au plein format. Les directives permettent ainsi la maintenabilité
et la simplicité du code.
 */
angular.module('tmdb')
    .directive('movieThumb', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                movie: '=',
                limit: '@?'
            },
            templateUrl: '/templates/directives/movie/thumb.html',
            controller: [
                '$scope',
                function($scope) {
                    $scope.limit = $scope.limit || 200;
                }
            ]
        }
    })
    .directive('movie', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                movie: '='
            },
            templateUrl: '/templates/directives/movie/movie.html'
        }
    });
