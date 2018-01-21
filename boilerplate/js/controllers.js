/*
Ici, je déclare mes controllers reliés à mes routes. Il y a toujours deux choix lors de l'assignation
d'un controller à une composante, comme une route ou une directive. Soit on crée un controller assigné
au module via controller() en indiquant son nom sur la propriété controller de la composante (comme
c'est fait actuellement), soit on déclare le controller directement au niveau de la composante.

L'avantage de déclarer le controller à part est d'une part le suivi du pattern MVC, où les composantes
sont séparées en tout temps et doivent être autonomes, sans considérer le contexte. Également, la
déclaration à part de la composante agit exactement comme la déclaration d'une variable globale plutôt
que l'utilisation directe d'une valeur: il y a possibilité de réutilisation par d'autres composantes.

Un exemple de réutilisation est lorsqu'un controller sert à une route (comme app.post.create) pour
l'affichage d'une portion de page qui affiche un formulaire pour créer un post, mais que le même
formulaire (ou presque) et le même behaviour doit être réutiliser dans un popup "shortcut" via un
bouton flottant dans la page de création d'un post.
*/
angular.module('app')
    .controller('appCtrl', [
        '$scope',
        function ($scope) {
            /*
            Ce controller sert à châpeauter le reste des routes du namespace "app".
            On va gérer le model "currentUser", "notifications" et tous les autres
            models globaux. Il est important de souligner qu'à ce stade, la route
            est déjà "resolved", donc l'ensemble des inconnus comme le currentUser,
            les notifications de départ et les autres (qui proviennent souvent d'un
            API ou d'un repository comme le localStorage) sont maintenant connus.
            Ils devraient normalement avoir été resloved depuis la déclaration de
            "resolve" de la route et ensuite utilisés dans le $scope du controller.
            Comme ce parent est le "root" du namespace des autres routes (puisqu'ils
            sont nommés avec la notation en point "app.foo.bar"), les $scope enfants
            des autres routes vont hérités de ce $scope.
            */
        }
    ])
    .controller('indexCtrl', [
        '$scope',
        function ($scope) {
            /*
            Ici, il ne s'agit que du controller de la page d'accueil.
            La page des posts n'héritera pas de ce $scope puisqu'ils
            sont frères et non parents.
            */

        }
    ])
    .controller('post.indexCtrl', [
        '$scope', 'posts',
        function ($scope, posts) {
            /*
            Ici, les posts ont été resolved. Un resolve peut être injecté
            comme n'importe quel composante injectable.
            */
            $scope.posts = posts;
        }
    ])
    .controller('post.showCtrl', [
        '$scope', 'post',
        function ($scope, post) {
            /*
            Le post a aussi été resoled depuis la route.
            */
            $scope.post = post;
        }
    ]);
