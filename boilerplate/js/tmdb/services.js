/*
Ce service est l'essence-même du module. Il permet l'ensemble des transactions avec TMDb.
Normalement, un provider() aurait été utilisé pour permettre la configuration des "constantes",
mais pour garder une simplicité quant à la démonstration de l'utilisation d'un API externe,
des constantes ont été faites.

Le service $tmdbAPI est le seul service qu'offre ce module. Le service comprend trois méthodes:

getMovie(id)
getImageUrl(movie, size = 500, type = "poster")
searchMovies(query, page = 1)

 */
angular.module('tmdb')
    .factory('$tmdbAPI', [
        '$http', 'serialize', 'TMDB_API_URL', 'TMDB_IMAGE_URL', 'TMDB_TOKEN', 'TMDB_LANGUAGE', 'TMDB_DEFAULT_IMAGE_SIZE', 'TMDB_DEFAULT_IMAGE_TYPE', 'TMDB_DEFAULT_IMAGE_URL', 'TMDB_DEFAULT_IMAGE_BACKDROP_URL',
        function ($http, serialize, TMDB_API_URL, TMDB_IMAGE_URL, TMDB_TOKEN, TMDB_LANGUAGE, TMDB_DEFAULT_IMAGE_SIZE, TMDB_DEFAULT_IMAGE_TYPE, TMDB_DEFAULT_IMAGE_URL, TMDB_DEFAULT_IMAGE_BACKDROP_URL) {
            // Voici l'ensemble des tailles d'image disponibles selon le type d'image voulu.
            // En temps normal, ces configurations auraient été chargées via https://api.themoviedb.org/3/configuration.
            // Encore une fois, pour une question de simplicité, la variable a été construite directement pour bien voir
            // le résultat pour bien comprendre quelques mécaniques internes.
            /**
             * @type {{backdrop: string[], logo: string[], poster: string[], profile: string[], still: string[]}}
             * @private
             */
            var imageSizes = {
                "backdrop": [
                    "w300",
                    "w780",
                    "w1280",
                    "original"
                ],
                "logo": [
                    "w45",
                    "w92",
                    "w154",
                    "w185",
                    "w300",
                    "w500",
                    "original"
                ],
                "poster": [
                    "w92",
                    "w154",
                    "w185",
                    "w342",
                    "w500",
                    "w780",
                    "original"
                ],
                "profile": [
                    "w45",
                    "w185",
                    "h632",
                    "original"
                ],
                "still": [
                    "w92",
                    "w185",
                    "w300",
                    "original"
                ]
            };

            /**
             * Permet d'effectuer une requête GET à l'API en envoyant la clé d'API et la langue souhaitée.
             * @see https://developers.themoviedb.org/3/getting-started/authentication
             *
             * @param {string} uri
             * @param {{}} params [{}]
             * @returns {Promise}
             * @private
             */
            function get(uri, params) {
                params = params || {};
                // On ajoute la clé d'API qui est stocké en constante.
                // Dans le cas d'un API demandant une authentification plus poussée,
                // avec un courriel et un mot de passe, par exemple, la façon de procéder
                // serait différente de celle-ci. TMDb demande simplement à ce que la
                // clé d'API soit fourni comme cela: http://foo.com/bar?api_key=1q2w3e4r5t6y7u8i9o0p
                params.api_key = TMDB_TOKEN;

                // Par convenance, l'API nous permet de sélectionner la langue de retour.
                // Les propriétés de ou des objets vont être les mêmes, mais les valeurs
                // vont être traduites si elles sont disponibles dans la langue spécifiée.
                params.language = TMDB_LANGUAGE;

                // On retourne la promesse $http.get() directement, sans aucune manipulation ni aucune interception.
                return $http.get(TMDB_API_URL + uri + '?' + serialize(params));
            }

            /**
             * Cette fonction permet de récupérer la ficher d'un film.
             * @see https://developers.themoviedb.org/3/movies/get-movie-details
             *
             * @param {int|string} id
             * @returns {Promise}
             * @public
             */
            function getMovie(id) {
                // On effectue la requête
                return get('movie/' + id, {
                    append_to_response: 'genres'
                })
                // Une fois la réponse obtenu, on la manipule.
                // Soit on retourne un film, soit un ne retourne rien.
                // L'appleant devra alors valider s'il a bien reçu un film.
                    .then(function (response) {
                        return response.data;
                    }, function () {
                        return null;
                    });
            }

            /**
             * Cette fonction permet de reconstruire l'URL d'une image selon la taille et le type voulu.
             * @see https://developers.themoviedb.org/3/getting-started/images
             *
             * @param {TMDbMovie} movie
             * @param {int|string|null} size [TMDB_DEFAULT_IMAGE_SIZE]
             * @param {string|null} type [TMDB_DEFAULT_IMAGE_TYPE]
             * @returns {string}
             * @public
             */
            function getImageUrl(movie, size, type) {
                type = type || TMDB_DEFAULT_IMAGE_TYPE;
                size = getValidImageSize(size, type);
                var name = movie[type + '_path'] || '';
                if (name) {
                    return TMDB_IMAGE_URL + size + name;
                }

                return type === 'backdrop' ? TMDB_DEFAULT_IMAGE_BACKDROP_URL : TMDB_DEFAULT_IMAGE_URL;
            }

            /**
             * Cette fonction retourne une taille valide d'image selon la taille demandé et le type.
             * @see https://developers.themoviedb.org/3/configuration/get-api-configuration
             *
             * @param {int|string|null} size [TMDB_DEFAULT_IMAGE_SIZE]
             * @param {string|null} type [TMDB_DEFAULT_IMAGE_TYPE]
             * @throws Error
             * @returns {string}
             * @private
             */
            function getValidImageSize(size, type) {
                size = size ? size : TMDB_DEFAULT_IMAGE_SIZE;
                type = type || TMDB_DEFAULT_IMAGE_TYPE;
                size = /[0-9]/.test(size.toString().charAt(0)) ? ('w' + size) : size;

                if (!imageSizes[type]) {
                    throw new Error('Image type "' + type + '" is not valid.');
                }

                var set = imageSizes[type];

                if (set.indexOf(size) === -1) {
                    return set[set.length - 1];
                }

                return size;
            }

            /**
             * Cette fonction permet d'effectuer une recherche par mot-clé et par page à l'API.
             * @see https://developers.themoviedb.org/3/search/search-movies
             *
             * @param {string} query
             * @param {int|null} page [1]
             * @returns {Promise}
             * @public
             */
            function searchMovies(query, page) {
                // On effectue la requête de recherche.
                return get('search/movie', {
                    query: query,
                    page: page || 1
                })
                // Une fois la réponse obtenu, si aucune erreur n'est survenue, on retourne les résultats.
                // Dans le cas où une erreur surviendrait, on aime que l'objet de base soit accessible lorsque possible.
                // Dans ce cas-ci, l'objet retourné est sensiblement simple comparativement à la réponse de getMovie().
                // La réponse possède une page, un results (un array), un total_pages et un total_results, donc simple
                // à reproduire. Pour bien reproduire, il est important de tester un résultat de réponse avec des données
                // retournées vides (avec un query de "lJDHFBAHJDFV", par exemple), pour se retrouver avec un objet semblable.
                    .then(function (response) {
                        return response.data;
                    }, function () {
                        return {
                            page: 1,
                            results: [],
                            total_pages: 1,
                            total_results: 0
                        };
                    })
            }

            return {
                getMovie: getMovie,
                getImageUrl: getImageUrl,
                searchMovies: searchMovies,
            };
        }
    ]);
