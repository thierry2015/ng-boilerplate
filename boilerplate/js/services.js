angular.module('app')
    .factory('apiService', [
        '$http', 'API_ROOT',
        function($http, API_ROOT) {

            function call(method, endpoint, query) {
                return $http[method](getUrl(endpoint, query));
            }

            function get(endpoint, query) {
                return call('get', endpoint, query);
            }

            function getUrl(endpoint, query) {
                endpoint = endpoint || '';
                endpoint = (endpoint.charAt(0) === '/' ? '' : '/') + endpoint;

                query = query || {};
                query = serialize(query);
                query = (query ? '?' : '') + query;

                return API_ROOT + endpoint + query;
            }

            function serialize(obj, prefix) {
                var str = [], p;
                for(p in obj) {
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
                call: call,
                get: get
            }
        }
    ]);
