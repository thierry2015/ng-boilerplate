/*
Je crée mon module principal, "app". Le deuxième paramètre est un array de modules sur lesquels repose mon module.
Une bonne façon de diviser une grande application ou une librairie AngularJS moindrement complexe est en la
subdivisant en différents sous-modules.

Voici un exemple concret d'architecture en plusieurs modules :

// Mon module d'API. Il ne dépend d'aucun module, sinon d'AngularJS (qui est automatiquement injecté).
angular.module('app.api', [])
    .factory('apiService', [...]);

// Mon module qui gère les posts. Il utilise l'API.
angular.module('app.content.post', ['app.api'])
    .controller('app.post.indexCtrl', [...]);

// Mon module qui gère les pages. Il utilise l'API.
angular.module('app.content.page', ['app.api'])
    .controller('app.page.indexCtrl', [...]);)

// Mon module gère le contenu. Il utilise les posts et les pages.
angular.module('app.content', [
    'app.content.post',
    'app.content.page'
]);

// Mon module global. Il utilise du contenu.
angular.module('app', ['app.content']);


Lorsqu'on fait une architecture en module, il est souvent intéressant de faire un module qui inclut
l'ensemble des sous-dépendances (comme "app.content", qui inclut l'API, les posts et les pages).
Il devient facile d'en faire la maintenance et de comprendre facilement les dépendances de l'application.


Dans le cas de ce module, il utilise la librairie "ui.router" (@uirouter/angularjs pour npm)
 */
angular.module('app', [
    'ui.router',
    'utils',
    'tmdb'
]);
