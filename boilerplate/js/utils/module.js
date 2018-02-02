/*
Je crée ici un module indépendant contenant des utilitaires.
Ce module peut ainsi servir de dépendance aux autres modules pour accéder aux différents utilitaires.

Il est important de noter que dès qu'une composante d'un module utilise un autre module, il faut
obligatoirement qu'il soit ajouté comme dépendance, même si un autre module le charge déjà.
Dans le cas du boilerplate, il doit être chargé à la fois dans "app" et dans "tmdb".
 */
angular.module('utils', []);
