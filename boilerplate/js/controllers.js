angular.module('app')
    .controller('appCtrl', [
        '$rootScope',
        function ($rootScope) {
        }
    ])
    .controller('indexCtrl', [
        '$scope',
        function ($scope) {

        }
    ])
    .controller('post.indexCtrl', [
        '$scope', 'posts',
        function ($scope, posts) {
            $scope.posts = posts;
        }
    ])
    .controller('post.showCtrl', [
        '$scope', 'post',
        function ($scope, post) {
            $scope.post = post;
        }
    ]);
