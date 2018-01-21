/*
Un filter est un outil assez puissant pour l'intégrateur: il permet de manipuler une valeur
en entré et en controller la sortie sans modifier le dit objet. Le terme "filter" peut
cependant porter à confusion dans le sens où il ne fait pas que filter. On peut l'utiliser
pour filter, modifier, ajouter, enlever et même évaluer une valeur.

Par exemple, je veux créer un filter qui formate un nombre pour qu'il ait toujours 2 caractères ou plus:

.filter('twoDigits', function() {
    return function(val) {
        // if (var < 10) {
        //     return '0' + val;
        // }
        // return val;

        return val < 10 ? '0' + val : val;
    }
});

Le filter viendra modifier strictement l'affichage si on fait {{ myValue | twoDigits }}, sans modifier myValue.


On peut également filtrer un tableau de données:

<div ng-repeat="val in arr | even">...</div>
.filter('even', function() {
    return function(arr) {
        var newArr = [];
        arr.forEach(function(val, index) {
            if (index % 2 == 0) { // index commence à 0, donc 0 % 2 == 0, 2 % 2 == 0, 4 % 2 == 0, etc.
                newArr.push(val);
            }
        });
        return newArr;
    }
});


Un filter peut aussi servir à évaluer une valeur:

<div ng-if="foo | isHigherThan:10" ng-bind="foo">
.filter('isHigherThan', function() {
    return function (val, threshold) {
        return val > threshold;
    }
});

On peut envoyer des paramètres au filter via la notation ":" (ce qui remplace "()").
On peut envoyer plusieurs paramètres comme ceci: foo | myFilter:true,'test',bar
Ce qui équivaut à faire myFilter(true, 'test', bar);
*/
angular.module('app')
    .filter('localeDate', function () {
        return function (date, locale) {
            // Je considère que "locale" est optionel, je gère donc une valeur par défaut.
            locale = locale || angular.element(document.documentElement).attr('lang') || 'en';
            var _date = new Date(date);
            switch (locale) {
                case 'fr':
                    var d = _date.getDate();
                    if (d === 1) {
                        d += 'er';
                    }
                    var m = getMonth(_date, locale).toLowerCase();
                    var y = _date.getFullYear();
                    return d + ' ' + m + ' ' + y; // "1er janvier 2018", "4 septembre 2018"
                case 'en':
                default:
                    var m = getMonth(_date, locale);
                    var d = _date.getDate();
                    var lastDigit = d % 10;
                    switch (lastDigit) {
                        case 1:
                            d += 'st';
                            break;
                        case 2:
                            d += 'nd';
                            break;
                        case 3:
                            d += 'rd';
                            break;
                        default:
                            d += 'th';
                            break;
                    }
                    var y = _date.getFullYear();
                    return m + ' ' + d + ', ' + y; // "January 1st, 2018", "September 4th, 2018"
            }


            /**
             * Get Date object's month depending on locale.
             * @param {Date} date
             * @param {string} locale ['en']
             * @returns {string}
             */
            function getMonth(date, locale) {
                var defaultLocale = 'en';
                var m = {
                    'en': [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                        'August',
                        'September',
                        'October',
                        'November',
                        'December'
                    ],
                    'fr': [
                        'Janvier',
                        'Février',
                        'Mars',
                        'Avril',
                        'Mai',
                        'Juin',
                        'Juillet',
                        'Août',
                        'Septembre',
                        'Octobre',
                        'Novembre',
                        'Décembre'
                    ]
                };

                if (!m.hasOwnProperty(locale)) {
                    locale = defaultLocale;
                }

                return m[locale][date.getMonth()];
            }
        }
    });
