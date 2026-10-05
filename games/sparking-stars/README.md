# Sparking Stars — six îles et boutique

FriendSDK 0.1.2, prototype noir et blanc dans le runtime officiel.
Lancer depuis la racine : `npm run dev:game -- games/sparking-stars --port 4174`.
Wallet Robinhood (4663) et Friend hardwired requis. Aucune transaction nécessaire.

## Courses
Six îles originales dans la grille 576 × 384 : Jardin, Carrière, Canaux, Ruines,
Fabrique, Citadelle. Ce ne sont pas des tailles officielles de GEN. Terrain attribué automatiquement par la GEN officielle ; autres terrains visibles mais verrouillés.
Flèches, ZQSD, WASD, clic ou toucher. Collecter les étoiles numérotées dans l’ordre
et revenir au départ. Hors-piste ralenti. Plus haut = passages plus techniques.
Une barricade contournable est placée à mi-chemin entre le départ et l’étoile 1.
Le casse-brique peut la supprimer sans déplacer le personnage.

## Boutique de simulation
300 pièces de test au début. Monnaie locale sans valeur RF, sans conversion,
sans financement ni engagement de paiement. Pas d’API monnaie ajoutée au SDK :
le modèle local sera à remplacer pour une économie persistante et financée.
Chaque arrivée crédite une seule fois : 30 + 5 × GEN + bonus médaille
(Or 35, Argent 20, Bronze 10). Or <= (distance du circuit / 170 × 1.65 + 0.25 × GEN)/vitesse
secondes ; Argent <= 1.3 × ce seuil. Seuils provisoires à équilibrer en jouant.
Les records sont séparés par terrain, équipement, tier et bonus sélectionné.
Rechargement ou changement d’identité réinitialise toutes les données de test.
Aucune sauvegarde serveur, aucun classement en ligne ni quota quotidien réel.

Tiers officiels 0–4 lus sur le personnage ; aucun tier vendu dans la boutique :
0. Aucun avantage ; prix normaux.
1. Une étoile intermédiaire offerte.
2. Rollers achetables : 180 de base, +20 % de vitesse.
3. −20 % sur les articles. Aucune autre remise de tier.
4. Kart achetable : 450 de base, +45 % de vitesse.
Source : https://rarefriends.com/docs/generations et ABI du manifeste public
https://rarefriends.com/api/protocol/config. Lecture à un même bloc récent de
Generations.generation, Generations.activationManager puis ActivationManager.positions.
Échec réseau ou valeurs hors limites : pas de terrain ou de tier inventé, bouton Réessayer.
Le runtime SDK garde le contrôle du wallet et de l’éligibilité. Aucun signer ajouté.
Recharger après une promotion/upgrade pour relire les valeurs. Une promotion peut
réinitialiser le tier officiel. Cette intégration lit seulement l’état du NFT.
Prix arrondis à l’entier supérieur. Équipement permanent pendant cette session.
Rollers et kart : chacun 3 départs par session ; recommencer dépense une énergie.
À pied : illimité. Aucun rachat d’énergie. Boutique accessible entre les courses.

Bonus équipables : boost (25 de base, +60 % 3 secondes), casse-brique (30 de base,
retire la barricade à moins de 85 unités). Achat ajoute un exemplaire au stock.
Un seul bonus équipé, un seul usage par course ; activation par Espace ou bouton.
Débit seulement lors d’une activation réussie. Pas de son ; préférence de réduction
 des animations respectée. Pause quand menus runtime ouverts ou onglet masqué.

## Sources et validation
Décors et sprites : SDK selon NOTICE.md. Renderer local adapté de GameWorld,
Apache-2.0 ; imports publics seulement. Tracés/obstacles dans terrains.json.
Le game.json conserve le schéma de packs obligatoire du runtime mais aucun achat,
play ou redeem SDK n’est appelé dans ce jeu. Il ne décrit pas l’économie locale.
Aucun contrat déployé ni transaction signée. Une signature de connexion gratuite est requise pour le classement public.

Commandes de contrôle depuis la racine :
- `npx friendsdk check games/sparking-stars`
- `node games/sparking-stars/test-economy.mjs`
- `node games/sparking-stars/test-profile.mjs`
Tests de profil : six GEN, cinq tiers officiels, verrouillage des autres terrains
et échec RPC bloquant. Fixtures réservées aux tests automatisés ; aucun faux
profil publié. Les anciens tests de sélection libre/achat de tiers sont historiques
et ne correspondent plus aux règles actuelles.

## Départ et objectifs
Décompte de trois secondes après chargement du personnage : déplacement, chrono
et bonus bloqués jusqu’au départ. La pause du runtime suspend aussi le décompte.
Le chrono mesure le temps actif réel ; le déplacement reste découpé en pas sûrs
pour conserver les collisions et les bonus à faible fréquence d’images.
Une flèche et un trait pointillé guident vers l’étoile suivante. Barre de progression,
signal hors-piste et objectifs Or/Argent visibles. Arrivée avec médaille et écart
vers l’objectif suivant. Effets sans clignotement ni son, tout en noir et blanc.

Calibration provisoire : Canaux GEN 3 à pied, Or 16.9 s, Argent 22.0 s,
à partir du tour joueur de 15.8 s sans boost. Autres GEN à affiner en jouant.

## Modes
Entraînement sélectionné au lancement : départs illimités avec équipements déjà
achetés, sans énergie consommée, récompense, consommable ou étoile offerte.
Sélection d’équipement indépendante de la course libre, même avec zéro énergie.
Records séparés par mode et équipement, conservés seulement durant la session.
Course libre : règles précédentes avec gains de test, avantages de tier et énergie.
Compétition bêta : classement public, toutes les étoiles sans consommable ni avantage de tier. Catégories à pied, rollers (tier 2+) et kart (tier 4). Aucun quota quotidien ni gain RF.
Fantôme personnel disponible (voir ci-dessous). Temps intermédiaires à venir.

## Vestiaire
Dans la boutique : au naturel, casque damier, casquette du paddock, antenne étoile.
Première collection offerte, sans achat ni avantage de performance. Superposition
vectorielle monochrome au sprite canonique conservé. État par session, réinitialisé
au changement de Friend ou rechargement. Pas de pass payant ni de NFT accessoire.

## Présentation du pilote
Le vestiaire affiche le véritable sprite du Friend sélectionné avec son accessoire.
Sillages offerts : étoiles ou damier, 10 marques maximum, durée 650 ms, uniquement
en mouvement. Désactivés avec réduction des animations ; pause du runtime respectée.
Arrivée avec damier et annonce du premier/nouveau record de la catégorie courante.
Purement visuel, sans effet sur vitesse, prix, collisions ou récompenses.

## Tableau des chronos
Bouton Chronos : meilleurs tours par Friend, historique des dix derniers tours,
référence top 1 et écarts. Filtrage GEN, équipement, mode et périodes calendaires
UTC (semaine commence lundi). Course libre filtrée également par tier et bonus
équipé. Temps arrondis une fois à la milliseconde à l’arrivée ; égalités de rang
1, 1, 3. Session locale uniquement, remise à zéro à chaque identité/rechargement.
Aucun faux pilote ou score injecté. « Voir le classement public » ouvre le top 100 Supabase, séparé des chronos locaux. Voir [le serveur](../../supabase/README.md) pour les contrôles et leurs limites. Le build public utilise `node scripts/build-sparking-public.mjs`.

## Mini-saison Constellations (gratuite)
Du 26 septembre 2026 00:00 UTC au 24 octobre 2026 00:00 UTC exclus.
Dans Boutique, la collection utilise des étoiles de style sauvegardées sur le
serveur, distinctes des objectifs de piste et des pièces de garage locales.
Chaque Friend reçoit 10 étoiles de style pour chacune de ses trois premières
courses classées acceptées du jour UTC. Les autres courses comptent pour les défis.
Pass gratuit : couronne stellaire après 1 course, halo de lune après 5,
sillage de comètes après 10. Boutique : casque comète 30, éclipse double 50,
ondes orbitales 60. Aucun effet sur la physique, aucun RF ni argent réel.
Les résultats déjà acceptés dans la fenêtre de saison sont crédités une fois.
La collection et le solde suivent le Friend (y compris s’il change de propriétaire).
Connexion signée gratuite nécessaire après rechargement pour retrouver le style
sauvegardé. Les quatre looks de lancement restent gratuits et utilisables localement.
Les étoiles et articles acquis persistent après la saison ; cette première boutique
reste accessible. Pas encore de pass premium ou boutique de retour temporaire.
Les cosmétiques pourront revenir : aucune exclusivité définitive promise.

Tests : `node server/test-season-browser.mjs` et `supabase db query --linked --file supabase/tests/season.sql`.

## Fantôme et contrôles directs
Après un tour complet, le meilleur parcours est rejoué par un Friend translucide
sans collision. Catégories séparées par wallet, Friend, GEN, mode, équipement,
version des règles et commandes ; aucun fantôme en course libre. En compétition,
la sauvegarde attend l’acceptation serveur. Un tour incomplet/refusé ne remplace
pas le fantôme. Une égalité conserve le précédent. Réglage dans Modes, désactivé
par défaut avec réduction des animations. Temps actif uniquement : pauses et
décompte n’avancent pas le fantôme. Fin de rejeu à l’arrivée. Aucun effet physique.
Le meilleur fantôme est sauvegardé dans ce navigateur par le host de confiance,
sans signature ni connexion au classement. Recharger le jeu le restaure, avec
son chrono dans Chronos. Changer de wallet ou Friend ne mélange pas les parcours.
Le sandbox conserve son origine isolée ; il n'accède pas directement au stockage.
Si le stockage est bloqué ou plein, le fantôme reste disponible pour la session.
La sauvegarde est bornée à 2 millions de caractères par wallet/Friend/version ;
les catégories les moins récemment enregistrées peuvent être retirées à cette limite.
Effacer les données du navigateur efface ces fantômes. Pas de synchronisation entre
appareils. Les anciens records sans trajectoire ne produisent pas de fantôme.

Classements Tactile et Clavier / souris distincts, dans Chronos et côté serveur.
Les commandes initiales se règlent dans Modes. Une souris, un stylet ou une touche
de déplacement reclasse définitivement le tour côté clavier / souris, y compris
sur téléphone. Le fantôme et le défi du créateur suivent la même catégorie.
Le serveur valide le journal de commandes et interdit les rétrogradations.
Cette détection par événements navigateur ne certifie pas le matériel contre un
client modifié ; le classement reste une bêta sans prix. Les anciens chronos
restent accessibles dans Historique · commandes inconnues, sans attribution inventée.

Clic/tactile : déplacement direct vers le point visé, arrêt devant le premier
obstacle. Aucun contournement automatique ; le joueur vise lui-même les détours.
Collisions/rayon inchangés, clavier conservé. Les records existants restent valides.
Le casse-brique utilise un décor sans barricade préchargé avant le départ : aucune
lecture d’artwork ni écran de chargement lors de la destruction en course libre.

Tests : `node server/test-ghost-controls.mjs`, `node server/test-ghost-browser.mjs`,
`node server/test-personal-ghost.mjs`, `node server/test-personal-ghost-browser.mjs`,
`node server/test-breaker-browser.mjs`. Le pilote de tests calcule ses propres
points de clic intermédiaires ; ce planificateur ne fait pas partie du jeu livré.

## Présentation adaptative
Le conteneur public adopte un cadre de paddock monochrome sur ordinateur, ajusté
à la hauteur de fenêtre, avec un bouton Mode cinéma (Fullscreen API sur geste
explicite du joueur). Sur téléphone, le cadre décoratif disparaît et le jeu garde
un format portrait avec les commandes tactiles. Aucun changement des règles.
Tests : `node server/test-presentation.mjs` (1440×1000, 1366×768 et 390×844 ;
bounds, menus, clavier et entrée/sortie du plein écran). Captures dans artifacts/.

## Le défi du créateur et la démo
Le défi vise le meilleur tour accepté du Friend #331213, GEN 3 à pied, depuis
le 26 septembre 2026 09:29 UTC (déploiement des commandes directes). Le serveur
écarte les scores retirés et les autres versions de règles. La cible est figée
au moment où le joueur choisit le défi. Seuls les Friends GEN 3 peuvent le relever,
en compétition sans bonus ; le résultat attend l’acceptation du serveur. Aucun lot.

Sur ordinateur, Filmer la démo propose la sélection native d’un onglet/fenêtre
via getDisplayMedia. Capture locale sans audio, arrêt à 45 secondes ou à la demande,
tracks arrêtées et lien de téléchargement MP4/WebM suivant le navigateur. Aucun
envoi automatique et aucune captation sans sélection explicite. La vidéo finale
nécessite que le joueur choisisse l’onglet et joue ; les captures de tests ne sont
pas présentées comme ses courses. Scénario conseillé : défi, course avec fantôme,
classement, collection et retour à l’île.

Les circuits sont inversés intégralement : GEN 1 Citadelle, 2 Fabrique, 3 Ruines, 4 Canaux, 5 Carrière, 6 Jardin. Chaque circuit conserve obstacles, tracé, ralentissement hors-piste et objectifs. La génération du NFT sélectionne toujours son terrain. Nouvelle version des règles : anciens chronos conservés hors du nouveau classement, collection inchangée. Le défi du créateur attend une nouvelle référence GEN 3 valide.

## Chrome mobile et connexion à la demande
Le host public utilise MetaMask Connect EVM 2.1.1 lorsqu’aucun provider injecté
n’est présent. Le bouton de connexion FriendSDK initialise le relais MetaMask
sur Robinhood. Sélection du Friend et signature du classement partagent ce provider.
Le jeu reste dans Chrome ; MetaMask sert aux autorisations et à personal_sign.
Le retour automatique dépend du navigateur et de l’application : revenir à l’onglet
Chrome si Android ne le ramène pas automatiquement. Aucun lien /dapp/ ne déplace
le jeu dans le navigateur MetaMask. Le parcours Android complet reste à confirmer
par le joueur ; les tests automatisés ne remplacent pas cette validation réelle.
La barre de signature est cachée au lancement, à la lecture du classement public,
après connexion et au retour à l’entraînement. Elle apparaît sur demande de course
classée ou de collection sauvegardée, avec possibilité de la fermer.
Tests : test-wallet-relay.mjs, test-auth-on-demand.mjs, test-public-browser.mjs,
test-season-browser.mjs, test-presentation.mjs dans server/.
Audit npm : dépendance transitive uuid signalée modérée (GHSA-w5hq-g745-h8pq),
sans correctif proposé par npm pour la chaîne MetaMask actuelle. Aucune utilisation
directe de ses fonctions v3/v5/v6 avec buffer dans notre adaptateur.

## Quêtes personnelles

Ouvrir Progresser → Quêtes, ou Voir mes quêtes après un tour. Première empreinte
récompense le premier tour, Étoile régulière trois tours, et Chasseur de fantômes
la première amélioration du meilleur fantôme. Ces badges sont personnels, sans RF,
monnaie, équipement ou avantage compétitif. Les anciens chronos ne deviennent pas
des tours accomplis rétroactivement ; le meilleur fantôme existant reste cependant
la référence de l'exploit d'amélioration.

Le défi renouvelable attend cinq tours terminés, puis choisit la trajectoire du
temps médian des cinq derniers tours. Sa cible reste figée : un tour plus lent
ne la change pas. Battre cette cible OU terminer trois tours dans la marge de 3 %
au-dessus de son temps valide le défi. Les trois tours proches ne doivent pas être
consécutifs. Une réussite sélectionne la nouvelle médiane des cinq derniers tours
pour le défi suivant. Le bouton du carnet permet de rejouer cette trajectoire ou
de revenir au meilleur fantôme personnel.

Seuls les tours terminés en entraînement et les tours acceptés en compétition
comptent ; jamais les courses libres, abandons ou publications refusées. Chaque
Friend/GEN/mode/équipement/règles/commandes a sa progression distincte. Un passage
à la souris utilise la catégorie clavier/souris. La sauvegarde locale dans le
parent de confiance est isolée par wallet et Friend, limitée à 2 Mo, et valide les
parcours et catégories. En cas de stockage bloqué, la progression reste disponible
pendant la session. Les trajectoires récentes sont espacées d'environ 250 ms pour
limiter leur taille. Les quêtes locales ne constituent pas une preuve pour accorder
une récompense serveur. Aucun serveur ou contrat supplémentaire n'est déployé.

Tests : server/test-quests.mjs et server/test-quests-browser.mjs, plus le parcours
classé dans server/test-public-browser.mjs.

## Paddock et palette

Trois destinations regroupent les écrans : Courir (mode, équipement, commandes
et terrains), Progresser (quêtes, chronos, fantôme, défi du créateur), Garage
(boutique et collection). Changer de destination ferme le panneau précédent.
La navigation disparaît pendant un tour ; Quitter ramène au paddock sans terminer
le tour ni faire progresser une quête. Le résultat présente le chrono, le progrès
et Rejouer ; les références supplémentaires se déplient dans Détails du tour.

Fond blanc cassé, textes charbon, contours gris et surfaces légèrement arrondies
remplacent les grands cadres noirs dans l'interface. La géométrie des circuits,
les règles, la sauvegarde et les contrats restent inchangés. Le dialogue de
signature demeure dans le parent de confiance. Tests : test-paddock-ui.mjs,
test-mobile-layout.mjs, test-race-focus.mjs et les parcours de course, quêtes,
fantômes, connexion à la demande et défi du créateur dans server/.

La vue course s'active désormais automatiquement après un départ réussi, dans la
fenêtre du navigateur, sans exiger le plein écran natif. La barre des menus et le
cadre du paddock s'effacent. Les étoiles donnent un retour visuel bref, désactivé
en animation avec la réduction des mouvements ; la dernière étoile annonce le
retour à l'arrivée. Rejouer garde cette vue, Retour au paddock et Quitter restaurent
les menus. En compétition, la connexion et l'enregistrement serveur précèdent
l'activation. Tests : server/test-immersive-race.mjs, PC et mobile portrait/paysage.

Le rendu prépare les segments immuables du circuit une seule fois pour les calculs
de distance à la route, sans tableau temporaire à chaque image. Les règles serveur
restent inchangées ; test-route-distance.mjs compare exactement 16 940 mesures avec
le calcul existant. Cela n'établit pas une trajectoire optimale autour des obstacles.

## Joystick et course Halloween

Sur appareil tactile, le joystick fixe en bas à gauche utilise les huit directions
et la vitesse des commandes existantes. Le second pouce peut toucher le circuit.
Relâchement, perte de capture, pause et sortie arrêtent le déplacement. Une souris,
un stylet ou les touches de conduite conservent la classification PC.

Courir propose Halloween · La boucle hantée, une exploration séparée des GEN.
Le passage trompeur téléporte au point précédent sans remettre le chrono à zéro ;
une lanterne suggère le détour secret qui brise la boucle. Cette course à pied,
accessible après la vérification habituelle du Friend, ne publie aucun classement,
ne verse aucune récompense et ne modifie ni quêtes ni fantômes des GEN.
Tests : server/test-touch-stick.mjs et server/test-halloween.mjs.

## Retours de jeu Halloween et mobile

Le piège Halloween est invisible et déclenche plus tôt. Il ramène au départ,
remet les étoiles à reprendre et conserve le chrono. La détection sur le segment
empêche de le sauter à faible cadence ; atteindre l’étoile suivante sans découvrir
le passage renvoie également au départ. Aucun texte ne donne la solution.

La caméra cadre chaque île dans son rectangle projeté. En paysage tactile,
l’espace central est libéré entre les commandes ; Recommencer et le plein écran
restent accessibles séparément. Les coordonnées du pointeur utilisent ce même
cadrage. Tests Halloween : PC, portrait et paysage 960 × 343 avec espace navigateur.
Les circuits des six GEN et les règles serveur restent race-6ec93f2d569491df.
Le retour Halloween forme une petite chicane autour d’un trou ; quelques
citrouilles et pierres tombales habillent le circuit. Les six étoiles et les
commandes habituelles sont conservées.

## Essai joueur GEN 6 (octobre 2026)
La branche feature/gen6-preview reprend la version publique du 4 octobre.
Seule la route du Jardin GEN 6 est remaniée : onze étoiles, largeur 44, rayon de collecte 21 et circuit en huit avec croisement central libre. La surface et le contour de l’île sont conservés. La caisse de départ est décalée sur le côté via startingObstacle, partagé par le jeu et le validateur. Les GEN 1 à 5 conservent leurs définitions.
Le build est publié sous /gen6-preview/ pour un essai en entraînement avec un vrai Friend GEN 6. TRACK_PREVIEW bloque course libre, départs et soumissions classés ; le serveur Supabase public n'est pas modifié.
Tests : node server/test-gen6-preview.mjs et node server/test-validation.mjs. Livrable : node scripts/build-sparking-public.mjs ../../outputs/gen6-site.
Après le retour du joueur, ajuster cette GEN avant de préparer la suivante. Une promotion de la route dans la version principale nécessite la mise à jour cohérente du validateur et des règles du classement.


Dernier ajout GEN6 : seconde maison (crate SDK) en [180,318], face à la première en [180,252], pour former un passage sur le retour. Un repère cliquable de 44px apparaît pour la prochaine étoile10 au-dessus du décor. Il vise le sol via createDirectClick ; collecte uniquement à portée, collisions conservées, sans détour automatique. Tests souris/tactile, arrivée et36 simulations physiques passent.


## Essai GEN3 — marches alternées
Six dalles de pierre à gauche (étoiles2 à7) alternent droite/gauche. Chaque dalle demande un nouveau clic ou tap dans sa zone de30unités, puis une arrivée à moins de10unités. Le clic accepté vise automatiquement le centre de la dalle ; les dalles visibles mesurent26×20unités. Le joystick et le clic maintenu gardent la marche normale mais ne valident pas seuls les dalles. Aucun saut ni téléportation : le déplacement et les collisions restent ceux du SDK. Seule la GEN3 change ;16étoiles au total, porte conservée. Publication /gen3-preview/ en entraînement seulement, avec tout Friend GEN1–6 fraîchement vérifié. Le validateur Supabase public reste inchangé ; la future intégration au classement devra vérifier les actions des marches côté serveur. Tests : server/test-staircase.mjs et server/test-gen3-preview.mjs.
