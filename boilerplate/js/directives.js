angular.module('app')

    // Layout directives
    // ==================================================
    .directive('layout', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/templates/directives/layout/layout.html'
        }
    })
    .directive('top', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/templates/directives/layout/top.html'
        }
    })
    .directive('bottom', function () {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/templates/directives/layout/bottom.html'
        }
    })


    .directive('postThumb', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                post: '=',
                limit: '@?'
            },
            link: function ($scope) {
                $scope.limit = $scope.limit || 100;
            },
            templateUrl: '/templates/directives/post/thumb.html'
        }
    })
    .directive('post', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                post: '='
            },
            templateUrl: '/templates/directives/post/post.html'
        }
    });