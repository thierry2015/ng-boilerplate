# AngularJS Boilerplate

Ce boilerplate est fait pour bien comprendre les différents concepts
de AngularJS et quelques-unes de ces meilleures pratiques. Toute la
documentation se retrouve directement dans le code JavaScript et HTML.

## Installation
Pour installer et partir l'application, voici les étapes à suivre:

#### installation des dépendances
Pour installer les dépendances NPM:

`npm install`
ou
`npm i`

## Serveurs

#### Démarrage du serveur PHP
Le serveur fonctionne en PHP (une version >=5.4 devrait normalement bien
fonctionner mais a été testé avec 7.1.9). Par soucis de simplicité, les
deux commandes de démarrages du serveur vont être via le serveur interne
de PHP.

Il est important de noter que le serveur occupera le processus du terminal
en entier. Il faudra ouvrir deux instances du terminal pour faire fonctionner
les deux serveurs.

Pour démarrer le serveur PHP, voici les instructions:

`cd /path/to/project`

`cd server/public`

`php -S 0.0.0.0:8002`

Le serveur sera hébergé via http://localhost:8002. Le nom du post est
important puisqu'il est ainsi configuré au niveau de AngularJS.

#### Démarrage du serveur AngularJS

Pour garder le démarrage du serveur simple, la même ligne de commande
sera utilisée: le serveur sera donc PHP plutôt que NodeJS

`cd /path/to/project`

`cd boilerplate`

`php -S 0.0.0.0:8000`

Le port a très peu d'importance, tant qu'il ne s'agit pas du port 8002
(déjà utilisé par le serveur) et qu'il ne rentre pas en conflit avec
d'autres systèmes (WAMP/MAMP/XAMPP, YouTrack, etc.)

On peut maintenant accéder au projet boilerplate via http://localhost:8000
Pour bien tester le serveur, on peut maintenant y accéder via http://localhost:8002/post.php
Une réponse JSON devrait alors apparaître, comportant 3 posts.

#### Interruption d'un serveur

Pour arrêter le serveur, utiliser `ctrl+C` sur Windows ou `cmd+C` sur Mac au niveau du terminal.
