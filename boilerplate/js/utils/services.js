/*
Je définie ici mes services utilitaires pouvant être injectés dans n'importe quel composante.
On veut surtout créer des services qui ne dépendent d'aucun contexte pour une réutilisabilité accrue.
 */
angular.module('utils')
    .factory('serialize', [
        function () {
            /**
             * Serialize an object to an URL parameters string.
             *
             * @param {{}} obj
             * @param {string|null} prefix
             * @returns {string}
             * @private
             */
            return function serialize(obj, prefix) {
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
        }
    ]);
