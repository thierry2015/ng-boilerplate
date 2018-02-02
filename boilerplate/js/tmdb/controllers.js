/*
Il s'agit ici de mes controllers qui peuvent être bindé aux routes.
Il y en a un par route suggérée, soit "index" et "show".
À noter que "show" injecte un service "movie", qui n'existe pas. Il doit alors être resolv. par la route.
 */
angular.module('tmdb')
    .controller('movie.indexCtrl', [
        '$scope', '$element', '$timeout', '$tmdbAPI',
        function ($scope, $element, $timeout, $tmdbAPI) {
            // J'enregistre ici la valeur de $scope.query lors du clique de la recherche.
            // La variable me servira lors de la pagination.
            var lastQuery;

            // Ces deux variables existent au niveau du $scope pour en permettre l'affichage.
            // Cependant, pour prévenir la modification de données essentielles, on conserve
            // les valeurs initiales dans ces variables. On ne craint plus ainsi la modification
            // depuis le template via $scope.
            var currentPage;
            var totalPages;

            // Je rend public la faculté te réinitialiser le formulaire et les résultats.
            $scope.reset = function () {
                lastQuery = '';
                $scope.query = '';
                $scope.movies = [];
                $scope.currentPage = currentPage = 1;
                $scope.totalPages = totalPages = 1;
            };

            // Lors du form submission, la méthode search() est appelée, ce qui permet d'exécuter
            // une nouvelle recherche en effaçant les anciennes valeurs pour les renouveler selon
            // les résultats de la recherche.
            $scope.search = function () {
                lastQuery = $scope.query;

                // Si aucun caractère n'a été fournis dans la barre de recherche, on considère la
                // réinitialisation (choix éditorial...)
                if (!$scope.query) {
                    $scope.reset();
                    return;
                }

                // On utilise le service nous permettant de nous connecter à l'API de TMDb.
                // Une méthode préparée, searchMovie(), vient avec le service. On l'utilise
                // en lui donnant le texte recherché comme argument. Le second argument,
                // inexistant pour l'instant, est la page (défaut => 1)
                $tmdbAPI.searchMovies($scope.query || '')
                    .then(function (response) {
                        // Une fois les résultats obtenus, on vide la liste des films.
                        $scope.movies = [];
                        // On doit retourner la réponse pour y avoir accès dans le prochain .then().
                        return response;
                    })
                    .then(handleSearchResponse)
            };

            // Cette méthode sert à charger la prochaine page grâce à la dernière requête
            // qui a été enregistré ans lastQuery.
            $scope.loadNextPage = function () {
                // On débute par valider si la page existante n'est pas la dernière connue,
                // pour ne pas faire un appel d'API inutile.
                if (currentPage < totalPages) {
                    $tmdbAPI.searchMovies(lastQuery, currentPage + 1)
                        .then(handleSearchResponse);
                }
            };

            // Au début du chargement du controller, on initialise les valeurs grâce à reset().
            $scope.reset();

            /**
             * Cette function gère la réponse de l'API lors d'une recherche.
             * Elle s'assure d'ajouter un thumbnail complet au film pour en afficher l'image,
             * puis l'ajoute à la liste.
             * La fonction met également à jour les variables de recherche.
             *
             * @param response
             */
            function handleSearchResponse(response) {
                response.results = response.results || [];
                response.results.forEach(function (movie) {
                    movie.thumbnail = $tmdbAPI.getImageUrl(movie, 154);
                    $scope.movies.push(movie);
                });
                $scope.currentPage = currentPage = response.page;
                $scope.totalPages = totalPages = response.total_pages;
            }
        }
    ])
    .controller('movie.showCtrl', [
        '$scope', '$tmdbAPI', 'movie',
        function ($scope, $tmdbAPI, movie) {
            // Comme le resolve de la route nous envoie le "movie", on ne fait que l'assigner
            // au $scope tout en ajoutant le backdrop image à l'objet. Il faut cependant valider que
            // le film a bien été retrouvé par l'API. Le service retourne null lorsqu'une erreur survient.
            if (movie) {
                $scope.movie = movie;
                $scope.movie.backdrop = $tmdbAPI.getImageUrl($scope.movie, 780, 'backdrop');
            }
        }
    ]);
