Le jeu conservait uniquement des chronos locaux. Cette version ajoute une compétition bêta avec classement partagé par GEN, équipement et jour/semaine/mois UTC, tout en gardant l’entraînement et l’économie simulée.

La connexion se fait par signature gratuite dans le conteneur SDK. Le serveur vérifie la propriété du Friend, le tier de l’équipement, le départ unique, la trajectoire, les étoiles, les collisions et la vitesse. L’écriture est atomique et les renvois sont idempotents. Le jeton reste hors du sandbox ; les rôles clients ne peuvent pas écrire dans les tables.

Validation : typage strict, contrôle FriendSDK, 36 courses de physique sur 6 GEN et 3 catégories, parcours navigateur complet à 1000 et 390 px, tests SQL transactionnels avec rollback, refus de faux accès sur l’API déployée. Aucun score fictif conservé en production.

Limites : trajectoires synthétiques et bots possibles ; aucune récompense financière. La première signature et course avec un vrai wallet restent à effectuer par le joueur. Supabase est déployé ; la source reste proposée sur cette branche.
