/*
On déclare l'ensemble des routes dans ce fichier. La configuration se fait en ce moment via
la librairie "ui.router", considéré comme le meilleur router non-officiel pour AngularJS par la communauté.
$stateProvider possède la méthode .state(), qui accepte deux arguments: le nom de la route et un objet
de paramètres. L'ensemble de cet objet est accessible via $state.current lorsqu'on utilise ce service dans une
composante comme un controller.

Le nom de la route utilise une notation de parenté avec une syntaxe en points: "foo.bar" est un enfant de "foo".
Le concept de parenté permet l'affichage de view partielles au sein d'une même page (voir /post/1)
L'objet de configuration d'un state s'apparente à ceci:

{
    // "abstract" permet d'indiquer si une route est accessible ou non. Une route abstraite
    // peut être pratique pour chapeauter une section en créant un namespace, comme "app".
    // On peut dire d'une route abstraite qu'il s'agit d'un group wrapper d'un point de vue
    // de programmation: le controller associé, s'il y en a un, chabeaute les enfants.
    //
    // Default: false
    //
    abstract: false,


    // "url" permet d'indiquer le segment à ajouter à la séquence pour atteindre la route.
    // On parle d'un segment et non d'un URL complet puisqu'une route enfant d'une autre devrait comporter
    // la même URL racine que son parent. Un post ayant le ID 1 devrait suivre l'URL du parent, en ajoutant
    // simplement une valeur supplémentaire à l'URL. le segment sera donc /{id} plutôt que /post/{id}
    // On peut utiliser un URL statique ou dynamique.
    // statique: '/foo/bar'
    // dynamique: '/foo/{id}'
    //
    // Un paramètre dynamique peut être indiqué soit par :id ou {id}. On retrouvera souvent {id} comment notation.
    // Plusieurs autres possibilités existent au niveau du routing, beaucoup de documentation existe à cet effet.
    // Il s'agit de l'essentiel pour créer un SPA (Single Page Application)
    //
    // Default: null
    //
    url: '/foo',


    // "controller" est soit le nom d'un controller déclaré, soit une déclaration d'un controller.
    //
    // Default: null
    //
    controller: "myRouteCtrl",


    // "template" désigne le template à prendre au niveau de la route lors de l'affichage.
    // Il s'agit d'une chaîne de caractère représentant le html à afficher.
    //
    // Default: ''
    //
    template: '<div class="foo-page">{{ content }}</div>',


    // "templateUrl" indique l'URL du fichier de template à utiliser.
    //
    // Default: null
    //
    templateUrl: '/templates/pages/foo.html',


    // "resolve" est un élément très robuste de UI-router. Il permet d'injecter des dépendances
    // manuellement. L'avantage: tant que la dépendance ne sera pas résolue, la route ne sera pas affiché,
    // tout comme son controller. On peut donc créer toutes formes de variables accessibles pour le controller:
    // {
    //  // Valeur statique
    //  static: function() {
    //      return {foo: 'bar'};
    //  },
    //
    //  // Injection d'un service (donc l'injection de "api" devient un alias de "apiService"
    //  api: 'apiService,
    //
    // // Injection d'une valeur resolvé par une promesse (la valeur de "promise" existera au moment de la résolution de la requête)
    //  promise: [
    //      '$http',
    //      function($http) {
    //          return $http.get('/foo/bar')
    //      }
    //  ],
    //
    //  // Injection via une promesse avec manipulation
    //  promiseWithHandling: [
    //      '$http',
    //      function($http) {
    //          return $http.get('/foo/bar')
    //              .then(
    //                  function(response) {
    //                      return response.data.bar;
    //                  },
    //                  function(error) {
    //                      return null;
    //                  }
    //              );
    //      }
    //  ]
    // }
    //
    // Le resolve peut donc servir pour injecter des éléments statiques, des éléments provenant
    // d'un API, voir même du HTML de l'externe. Il s'agit d'une excellente façon de faire patienter
    // l'affichage de la route le temps d'aller chercher les données. Cependant, avec grands pouvoirs
    // viennent de grandes responsabilités. Une requête à un API fait mal en terme de temps de réponse.
    // Des resolve partout via $http ne font qu'alourdir l'application. La mise en cache de valeurs
    // externes plutôt statiques, comme la liste des enseignants de la session (qui ne risque pas de
    // changer aux 2 minutes) devient rapidement un incontournable. Mais il ne faut pas oublier ceci:
    // la route ne devrait jamais être responsable de ce genre de chose. Laissons tout ça aux services!
    //
    // Default: null
    //
    resolve: {
        value: [
            '$http',
            function($http) {
                return $http.get('http://my.api.com/my-endpoint');
            }
        ]
    }
}
*/
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
                                return apiService.getPosts();
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
                                return apiService.getPost($stateParams.id);
                            }
                        ]
                    }
                });
        }
    ]);
