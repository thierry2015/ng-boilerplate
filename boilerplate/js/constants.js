/*
Ici, on crée des constantes qui peuvent servir dans différents modules custom. Les constantes devraient
en principe servir uniquement au module conserné, pas à ses dépendances. S'il advient que le module dépendant
soit utiliser dans un autre contexte, la constante ne serait plus injectable puisqu'elle ne sera jamais définie.

Dans le cas où j'avais un sous-module "app.api" (comme dans l'exemple de app.js), la constante "API_ROOT"
aurait dû être attaché à "app.api", pas à "app".
 */
angular.module('app')
    .constant('API_ROOT', 'http://localhost:8002');