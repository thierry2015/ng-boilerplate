angular.module('app')
    .config([
        '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
            $stateProvider
                .state('app', {
                    abstract: true,
                    controller: 'appCtrl',
                })
                .state('app.index', {
                    url: '/',
                    controller: 'indexCtrl',
                    templateUrl: '/templates/pages/index.html'
                })
                .state('app.post', {
                    url: '/post',
                    controller: 'post.indexCtrl',
                    templateUrl: '/templates/pages/post/index.html',
                    resolve: {
                        posts: [
                            'apiService',
                            function (apiService) {
                                return apiService.get('/post.php')
                                    .then(function (response) {
                                        return response.data.posts;
                                    }, function (error) {
                                        console.error(error);
                                        return [];
                                    });
                            }
                        ]
                    }
                })
                .state('app.post.show', {
                    url: '/{id}',
                    controller: 'post.showCtrl',
                    templateUrl: 'templates/pages/post/show.html',
                    resolve: {
                        post: [
                            'apiService', '$stateParams',
                            function (apiService, $stateParams) {
                                return apiService.get('/post.php', {
                                    id: $stateParams.id
                                }).then(function (response) {
                                    return response.data;
                                }, function (error) {
                                    console.error(error);
                                    return {};
                                });
                            }
                        ]
                    }
                });
        }
    ]);


//
// var maPromesse = new Promise(function (resolve, reject) {
//     $.ajax('post', function (response) {
//         $.ajax('user', function (response) {
//             $.ajax('ksdibfias', function (response) {
//                 return response;
//             })
//         })
//     });
// });
//
//
// maPromesse
//     .then(
//         function (response) {
//             return response.data;
//         }, function (error) {
//             console.log('nope');
//             return error;
//         })
//     .then(function (posts) {
//         /*
//         posts == [
//             {
//                 id: 1,
//                 title: 'foo',
//                 content: 'lorem ipsum',
//                 author: 'Lorem Ipsum'
//             }
//         ]
//          */
//
//         posts.forEach(function(post) {
//             post.body = post.content;
//         });
//
//         return posts;
//     })
//     .then(function(posts) {
//         /*
//         posts ==  == [
//             {
//                 id: 1,
//                 title: 'foo',
//                 content: 'lorem ipsum',
//                 body: 'lorem ipsum',
//                 author: 'Lorem Ipsum'
//             }
//         ]
//          */
//     })
// setTimeout(function () {
//     console.log('bob');
// }, 100);
//
// console.log('post');

