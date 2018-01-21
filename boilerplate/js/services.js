/*
Le nerf de la guerre se passe ici! Les services et les providers sont ce qui fait d'AngularJS AngularJS.
Un service, c'est exactement comme une classe (en fait, en ES6 et en TypeScript, on peut en faire une classe).
On s'en sert comme d'une boîte noir: on se fout de comment elle fonctionne, tant qu'elle fonctionne.
C'est le cas des services de Firebase: plusieurs méthodes existent et sont utilisables, et plusieurs fonctionnalités
sont internets au service, comme une classe utilisant la notion d'encapsulation.

Par exemple, le service (ou la classe) ci-dessous, "apiService", permet d'interroger facilement l'API.
Les méthodes publiques sont retournées tout au bas dans un objet littéral. Ces méthodes sont getPosts()
et getPost(id). À l'interne, le procédé utilisé par le service ne devrait pas concerner son utilisation.

Dans le cas de ce cervice, l'utilisation de $http est essentiel, il est donc injecté pour pouvoir interroger l'API.
Mais une notion importante dans une SPA (Single Page Application) est la réactivité. Le changement de route ne
devrait pas prendre une éternité à chaque fois. La première navigation peut être plus longue, mais les requêtes
subséquentes devraient être rapides, surtout dans le cas de données plutôt statiques.

Dans le cas de l'application courante, on sait d'avance qu'il n'y aura pas de changement au niveau des données reçues.
Si l'API retourne toujours les mêmes valeurs, pourquoi continuer de l'interroger? On utilise alors un système de cache
interne à la classe, sous forme d'objet privé. il existe une tonne de façons d'implémenter un système de cache interne,
je l'ai gardé au plus simple pour cet exemple. Il ne fait que stocker la première réponse pour ne plus avoir à
interroger l'API les prochaines fois. lors du même "runtime".

Cependant, il faut toujours être constant dans notre façon de retourner une valeur. Le type ne peut pas passer d'une
boolean à un string à un array (notion de constance du typage). Comme $http retourne une Promise, la réponse du cache
devrait aussi retourner une Promise.

On introduit alors le service $q. Ce service sert de décorateur pour créer facilement des promesses en les manipulant
avec simplicité. $q.defer() permet de créer une instance du décorateur de promesse. Il y a alors une propriété et
deux méthodes à utiliser: promise (propriété de type Promise), resolve (méthode de résolution) et reject (méthode
de rejection). Donc on peut retourner la promesse et effectuer le processus de manière asynchrone.

La notion d'asynchronicité est essentiel aus Promises et à JavaScript. Dès qu'on déclare un bloc de code asynchrone,
il ne sera pas exécuté tout de suite. Il sera considéré aux prochain cycle interne de JavaScript. Un bon exemple
de code asynchrone est le setTimeout (ou le service $timeout de AngularJS). Lorsqu'on appelle setTimeout, le callback
donné devient alors asynchrone: il sera exécuté à l'extérieur du flow de son contexte, tout en conservant sa place
dans le contexte (accès aux variables, functions, etc. Bref, il garde le même scope).

Mais supposons qu'on appelle setTimeout(function(){ console.log('now!'); }, 0). On peut voir ici que le timeout va
durer 0 milliseconde. La logique veut que le code sera donc exécuté tout de suite. Ce n'est pas le cas en réalité.
Il sera exécuté au prochain cycle de JavaScript. Comme la fonction devient asynchrone, elle n'est pas exécuté lors
du cycle courant. L'astuce du setTimeout de 0 milliseconde permet d'exécuter du code immédiatement après le cycle
courant.

Dans le cas du bloc suivant:

function foo($q) {
    var deferred = $q.defer();
    deferred.resolve('resolved!');
    return deffered.promise;
}

On retourne une promesse. Mais on retourne une promesse APRÈS avoir resolvé cette promesse, ce qui brise un peu la
notion de base d'une promesse. En temps normal, on préfère retourner la promesse et ENSUITE la résoudre. Comme un
"return" marque la fin du bloc, il est impossible d'exécuter quoi que ce soit après ça. Le setTimeout de 0 seconde
vient corriger ce problème:

function foo($q, $timeout) {
    var deferred = $q.defer();
    $timeout(function() {
        deferred.resolve('resolved!');
    }, 0) // le temps est optionel dans le cas ou la valeur est 0
    return deferred.promise;
}

La promesse non-résolue est retournée et, immédiatement après, elle est résolue. Il s'agit donc d'une façon habile
de retourner des données cachées en simulant une requête AJAX au niveau du code. Mais le temps de réponse est de
loin plus court (moins d'une milliseconde pour les données cachées alors que cela peut prendre 300-400 voire 1000
millisecondes pour une requête AJAX.
*/
angular.module('app')
    .factory('apiService', [
        '$http', '$q', '$timeout', 'API_ROOT',
        function ($http, $q, $timeout, API_ROOT) {
            /**
             * Cache object.
             *
             * @type {{}}
             * @private
             */
            var _cache = {};


            /**
             * Get all the posts.
             *
             * @returns {Promise}
             * @public
             */
            function getPosts() {
                // Retourne les données cachées si elle existent
                if (_cache.posts && _cache.posts.length > 0) {
                    var deferred = $q.defer();
                    $timeout(function () {
                        deferred.resolve(_cache.posts);
                    });
                    return deferred.promise;
                }

                // Si les posts ne sont pas cachés
                return get('/post.php')
                    // On gère la réponse, qu'elle soit valide (code 200) ou non
                    .then(function (response) {
                        return response.data.posts || [];
                    }, function (error) {
                        console.error(error);
                        return [];
                    })
                    // Une fois la requête gérée et le format de base donné, on cache l'information,
                    // puis on retourne cette même information (le retour est essentiel dans un .then()
                    // pour que chaque function subséquente ait un paramètre en entré. Sinon, rien n'est
                    // envoyé aux callbacks).
                    .then(function (posts) {
                        _cache.posts = posts;
                        return posts;
                    })
            }


            /**
             * Get a single post.
             *
             * @param {int|string} id
             * @returns {Promise}
             * @public
             */
            function getPost(id) {
                // On gère le type de la valeur
                id = typeof id === 'string' ? parseInt(id) : id;

                // Dans le cas de cette application, comme /post est le parent de /post/{id},
                // et que /post resolvera toujours les posts en appelant getPosts(), le post sera
                // toujours mis en cache, sans exception. Il n'est cependant pas recommander de
                // prendre ce genre de choses comme étant une vérité absolue: la méthode du service
                // peut être utiliser n'importe où, n'importe quand...

                // Si les posts ont déjà été cachés
                if (_cache.posts && _cache.posts.length > 0) {
                    // On s'assure que le post en question existe.
                    var filtered = _cache.posts.filter(function (p) {
                        return p.id === id;
                    });
                    // Si le post est déjà caché
                    if (filtered.length === 1) {
                        var deferred = $q.defer();
                        $timeout(function () {
                            deferred.resolve(filtered[0]);
                        });
                        return deferred.promise;
                    }
                }

                // Si le post n'est pas caché
                return get('/post.php', {
                    id: id
                })
                    // On gère la réponse, qu'elle soit valide (code 200) ou non
                    .then(function (response) {
                        return response.data || null;
                    }, function (error) {
                        console.error(error);
                        return null
                    })

                    // Une fois la requête gérée et le format de base donné, on cache l'information,
                    // puis on retourne cette même information (le format peut être un Post ou null,
                    // il faut donc valider au préalable)
                    .then(function(post) {
                        if (post) {
                            _cache.posts.push(post);
                        }
                        return post;
                    });
            }


            /**
             * Call the API with a given method, entry point and query.
             *
             * @param {string} method
             * @param {string} endpoint
             * @param {{}} query [null]
             * @returns {Promise}
             * @private
             */
            function call(method, endpoint, query) {
                return $http[method](getUrl(endpoint, query));
            }

            /**
             * Call the API git GET method, with a given entry point and query.
             *
             * @param {string} endpoint
             * @param {{}} query [null]
             * @returns {Promise}
             * @private
             */
            function get(endpoint, query) {
                return call('get', endpoint, query);
            }

            /**
             * Get the full URL from given entry point and query.
             *
             * @param {string|null} endpoint
             * @param {{}|null} query
             * @returns {*}
             * @private
             */
            function getUrl(endpoint, query) {
                endpoint = endpoint || '';
                endpoint = (endpoint.charAt(0) === '/' ? '' : '/') + endpoint;

                query = query || {};
                query = serialize(query);
                query = (query ? '?' : '') + query;

                return API_ROOT + endpoint + query;
            }

            /**
             * Serialize an object to an URL parameters string.
             *
             * @param {{}} obj
             * @param {string|null} prefix
             * @returns {string}
             * @private
             */
            function serialize(obj, prefix) {
                var str = [], p;
                for (p in obj) {
                    if (obj.hasOwnProperty(p)) {
                        var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
                        str.push((v !== null && typeof v === "object") ?
                            serialize(v, k) :
                            encodeURIComponent(k) + "=" + encodeURIComponent(v));
                    }
                }
                return str.join("&");
            }

            return {
                getPosts: getPosts,
                getPost: getPost
            }
        }
    ]);
