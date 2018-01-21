/*
On déclare ici les directives. La déclaration d'une directive se fait de la même façon qu'un service ou
qu'un controller. Il est important de noter que le nom d'une directive doit être écrit en "camelCase"
et non en "kebab-case". À l'inverse, son utilisation se fait en "kebab-case". Une directive est déclarée
grâce au DDO - Directive Declaration Object. Un DDO est constitué de plusieurs propriétés facultatives,
certaines un peu obscure. Voici un exemple du DDO simple:

{
    // "restrict" permet d'indiquer au compilateur de quel type de directive il s'agit. Voici les 4 possibilité:
    // "E": Élément. L'utilisation de la directive se fait via <le-nom-de-la-directive></le-nom-de-la-directive>
    // "A": Attribut. L'utilisation se fait via <div ma-directive></div>
    // "C": Classe. L'utilisation se fait via <div class="ma-directive"></div>
    // "M": Commentaire. L'utilisation se fait via <!-- directive: ma-directive -->
    // Ils peuvent être combinés comme ceci: "EA".
    //
    // Default: "EA"
    //
    restrict: 'E',


    // "template" permet d'indiquer le template à utiliser à l'intérieur de la directive.
    //
    // Default: null
    //
    template: '<div class="foo">{{ type }}: <span ng-transclude></span></div>',


    // "templateUrl" permet de charger un template via un fichier externe. Il fonctionne
    // de la même façon que ngInclude. Le path doit être relatif au root page.
    // un template URL qui est dynamique (qui dépend d'un attribut, par exemple), peut
    // aussi être généré via une closure (function) de la manière suivante:
    // templateUrl: function(element, attributes) {
    //      var type = attributes.type || 'default';
    //      return '/templates/directives/foo-' + type + '.html'
    // }
    //
    // Default: null
    //
    templateUrl: '/templates/directives/foo.html',


    // "controller" fonctionne comme pour le controller d'une route. Soit on passe le nom
    // d'un controller déjà déclaré, sont un crée une directive directement.
    //
    // Default: null
    //
    controller: 'directive.fooCtrl',


    // "link" permet de manipuler la directive une fois que le lien entre les différents
    // éléments sont faits. Elle sert souvent pour attacher des listeners, (via $scope.$watch,
    // entre autre). À ce moment, le template existe et est manipulable. Les données sont
    // également transposées et compilées, donc accessibles. Il est donc dit "post-compile"
    // Il y a 5 paramètres accessibles, dans cet ordre:
    //  $scope: Le scope de la directive. Il s'agit du même objet que pour le controller.
    //  element: L'élément jqLite (une simplification de l'objet jQuery pour AngularJS)
    //  attrs: Les attributs de la directive sous forme d'un objet littéral ({foo: 'bar'}).
    //  controller: L'instance du controller
    //  transcludeFn: Un peu obscure au départ, ce paramètre est une fonction qui permet
    //                l'injection du "transclude" dans la directive (l'insertion de contenu
    //                dynamique dans la directive).
    //
    //                Par exemple, <alert>This is an alert</alert> possède du contenu
    //                dynamique (This is an alert). Le template ressemblerait à ceci:
    //                <div class="alert alert-default"></div>
    //
    //                On a donc deux choix. Soit on ajoute une indication de transclude:
    //                <div class="alert alert-default" ng-transclude></div>
    //                Ou on procède avec la function transcludeFn:
    //                element.append(transcludeFn());
    //                Les deux donneront:
    //                <div class="alert alert-default">This is an alert</div>
    //
    // Default: null
    //
    link: function($scope, element, attrs, controller, transcludeFn) {
        $scope.type = attrs.type || 'default'
    },


    // "replace" permet de remplacer l'élément comportant la directive. Dans le cas
    // où un remplacement est voulu, il est important de noter certaines choses.
    //
    // 1. Il faut toujours que le template n'ait qu'un seul parent (wrapper)
    // 2. Il faut que le wrapper ne soit pas remplacés ni manipulé pour défaire le
    //    concept de wrapper (ex. <div ng-repeat="foo in bar"></div>)
    // 3. Si un scope isolé est demandé, le wrapper ne doit pas comporter une directive
    //    demandant aussi un scope isolé (ng-if, par exemple)
    //
    // Default: false
    //
    replace: true,


    // "scope" est une notion qui est au départ difficile à maîtriser, mais qui devient
    // rapidement essentiel lorsqu'on crée plusieurs types de directives, surtout dans
    // un projet à échelle grandissante. Le scope permet de gérer l'isolation et la portée
    // de la directive tout en donnant la possibilité de trimbaler de l'information de
    // celui qui l'appelle vers la directive.
    //
    // Il y a principalement 3 options pour cette propriété:
    // 1. false -> Utilise le scope du parent tel quel
    // 2. true -> Utilise un nouveau scope qui hérite du parent.
    // 3. {} -> Crée un scope isolé, qui n'hérite d'aucun scope.
    //
    // Le scope isolé est souvent l'option à privilégier pour la portabilité de la directive.
    // En étant isolé, la directive peut être utilisé n'importe où, peu importe le contexte.
    // il peut s'agir autant d'un objet vide ({}), autant d'un objet spécifiant les variables
    // attendues du scope.
    //
    // Un exemple de variable du scope serait celui-ci:
    // <alert type="success">Ça marche!</alert>
    // "type" est une variable du scope, donc utilisable dans le $scope de la directive, donc
    // dans le template. Il faut cependant avertir AngularJS qu'il faut traiter une variable
    // comme étant dans le $scope, de la façon suivante:
    // scope: {
    //      type: '@'
    // }
    //
    // C'est là que ça se corse. Il faut bien définir le type de valeur attendu grâce à des
    // identifiants un peu obscures. Les voici:
    //
    // '@': La valeur sera prise telle quelle ($scope.theScopeType == "success"):
    //          type="success" -> "success"
    //          type="theScopeType" -> "theScopeType"
    //          type="{{ theScopeType }} -> "success"
    //      Il s'agit d'un type pour les valeurs à un sens (parent -> directive)
    //      La valeur est généralement un string, un int, un float, un boolean, etc. (type de base)
    //
    // '=': La valeur sera évalué comme une instance. ($scope.currentUser = {name: 'Lorem Ipsum', email: 'test@example.com'}):
    //          user="currentUser" -> {name: 'Lorem Ipsum', email: 'test@example.com'}
    //      Il s'agit d'un type souvent utilisé pour les objets, array, etc. (instance)
    //      Il s'agit d'un type pour les valeus à deux sens (parent <-> directive)
    //          Si la directive change une valeur, elle se répercutera chez le parent.
    //
    // '&': La valeur sera évalue comme une expression ($scope.onClick = function(msg) { console.log(msg); }):
    //          on-custom-click="onClick('Click!')" -> function(msg) { console.log(msg); }
    //      Il s'agit d'un type souvent utilisé pour les closures (function)
    //      Il s'agit d'un type pour les expressions à un sens (parent -> directive)
    //
    //
    // Il y a deux suffix possible et combinables pour chaque type: '?' et 'theUsedAttributeName'
    //
    // '?': Permet d'indiquer si le paramètre est optionel. Il est utilisable comme ceci: foo: '@?'
    //
    // 'theUsedAttributeName': Permet d'indiquer sous cel nom la valeur sera envoyé à la directive.
    //      Le nom doit toujours être en camelCase, mais l'assignation se fait en kebab-case.
    //      <alert alert-type="success">Yesss!</alert>
    //      {
    //          // Lors de l'appel de la directive, on utilise 'alert-type', mais on utilisera $scope.type
    //          type: '@alertType'
    //      }
    //      <div class="alert" ng-class="'alert-' + type" ng-transclude></div>
    //      <!-- Donne <div class="alert alert-success">Yesss!</div> -->
    //
    // Pour les combiner, il faut mettre le type, le flag optionel et le nom de l'assignation:
    // foo: '@?bar'
    //
    // Default: false
    //
    scope: {
        foo: '@',
        bar: '='
        type: '@?'
    },
}

Un DDO peut également comporter des méthodes de pré et post compilation, mais ce genre de
propriété commence à être un peu trop poussé pour un cours d'initialisation à AngularJS de 7 semaines...
On peut également indiquer qu'une directive dépend d'une autre directive via "require"
Si on crée "alertLink", et qu'on veut qu'il soit obligatoirement dans un "alert", on peut donc dire
que la directive "alertLink" { require: ["alert"] }. ils vont ainsi pouvoir communiquer.
*/
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


    // Post directives
    // ==================================================
    .directive('postThumb', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                post: '=',
                limit: '@?'
            },
            link: function ($scope) {
                // Comme le paramètre est optionel, je m'assure de lui donner une valeur par défaut.
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
