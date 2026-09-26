Le jeu conservait ses chronos et cosmétiques uniquement pendant la session. Cette bêta ajoute un classement partagé et une première collection saisonnière gratuite, tout en gardant le style noir et blanc et l’économie sans RF réel.

Le classement sépare GEN, équipement et périodes UTC. Une signature gratuite identifie le pilote ; le serveur contrôle propriété, départ unique, trajectoire et durée. Les résultats sont atomiques et idempotents. Le jeton reste dans le conteneur SDK, sans accès depuis le jeu sandboxé.

Constellations (26 septembre–23 octobre 2026 UTC) propose trois récompenses après 1/5/10 courses et trois cosmétiques achetables avec les étoiles de style. Les trois premières courses classées acceptées par jour rapportent chacune 10 étoiles. Le serveur sauvegarde le solde, les achats et l’équipement ; les résultats antérieurs éligibles sont crédités une seule fois. Aucun changement de performance.

Validation : typage strict, contrôle SDK, 36 parcours physiques, tests navigateur classement et saison desktop/mobile, tests SQL avec rollback (droits, idempotence, plafond, solde, déblocages, restauration et limites UTC), tests de rejet sur l’API réelle. Aucun score ou inventaire de fixture publié.

Limites : bots et trajectoires synthétiques restent possibles. Aucun prix financier, pass payant ou boutique éphémère activé. La collection gratuite suit le Friend ; la boutique de cette mini-saison reste disponible après sa fin.


Le fantôme rejoue le meilleur tour de la session par catégorie, sans collision et
avec contrôle d’affichage. Le clic/tactile ne contourne plus automatiquement les
obstacles. Le casse-brique utilise les assets préchargés pour éviter le chargement
en pleine course. Tests supplémentaires : rejeu desktop/mobile, interpolation et
isolation des catégories, arrêts directs sur les six GEN, destruction sans requête
réseau ni écran de chargement. Aucun changement des vitesses ou des collisions.

Présentation adaptative : cadre paddock monochrome sur ordinateur, mode cinéma fonctionnel et interface compacte sur téléphone. Vérifiée visuellement à 1440, 1366 et 390 px, avec contrôles et plein écran.
