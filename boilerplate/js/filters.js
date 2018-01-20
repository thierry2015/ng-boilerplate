angular.module('app')
    .filter('localeDate', function () {
        return function (date, locale) {
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
                    return d + ' ' + m + ' ' + y;
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
                    return m + ' ' + d + ', ' + y;
            }


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
