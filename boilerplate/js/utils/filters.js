/*
Je définie ici mes filtres utilitaires, qui ne touche aucun module en particulier et qui pourrait
être utilisé dans n'importe quel contexte.
 */
angular.module('utils')
    .filter('toFixed', function () {
        return function (number, limit) {
            limit = limit || 1;
            return parseFloat(number.toString()).toFixed(limit);
        }
    });
