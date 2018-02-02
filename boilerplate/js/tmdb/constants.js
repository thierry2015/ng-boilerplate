/*
Je déclare l'ensemble des constantes qui pourraient être utilisées et dévoilé à qui bon l'injecte.
Une constante est définie une seule fois. Pour utiliser des valeurs de configuration au niveau du
module (configurable par d'autres modules), il faudrait alors créer un provider, pour pouvoir
configurer le service sortant lors de l'appel des .config() déclarés.
 */
angular.module('tmdb')
    .constant('TMDB_API_URL', 'https://api.themoviedb.org/3/')
    .constant('TMDB_IMAGE_URL', 'https://image.tmdb.org/t/p/')
    .constant('TMDB_TOKEN', '925e31dde7874f9daba9e9607ac455b6')
    .constant('TMDB_LANGUAGE', 'en-US')
    .constant('TMDB_DEFAULT_IMAGE_SIZE', 500)
    .constant('TMDB_DEFAULT_IMAGE_TYPE', 'poster')
    .constant('TMDB_DEFAULT_IMAGE_URL', 'http://placehold.it/154x231')
    .constant('TMDB_DEFAULT_IMAGE_BACKDROP_URL', 'http://placehold.it/780x440');
