# Classement public Sparking Stars — bêta

Projet : `hkudnvqseodizcplkgvw`. Fonction : `sparking-api`.
Le conteneur de confiance conserve le jeton de session en mémoire. Le jeu sandboxé
n’a accès ni au wallet ni au jeton, seulement aux opérations prepare/start/finish/board
via un MessageChannel dont la source doit être l’iframe SDK courante. Il s’agit
d’une extension applicative explicite au bridge du SDK, pas d’un accès à son DOM.
Le GameHost officiel reste responsable de la connexion et de l’éligibilité.
Le conteneur utilise le même fournisseur injecté que GameHost. Sans fournisseur
injecté, le SDK peut encore découvrir un wallet, mais la compétition demande un
navigateur avec fournisseur injecté ; aucune deuxième connexion n’est créée.

## Authentification et résultats
- Signature personnelle gratuite, demandée seulement via le bouton du conteneur.
- Message fixe : domaine et URI du jeu, compte, chaîne 4663, nonce et expiration 5 min.
- Vérification viem du message, incluant les wallets EIP-1271 ; challenge consommé atomiquement.
- Jeton aléatoire de 256 bits, SHA-256 en base, expiration 1 h. Compte/réseau/iframe/identité changés : session locale invalidée.
- Propriété et GEN relues à un bloc frais au départ et à l’arrivée ; tier vérifié pour rollers (2+) et kart (4) au départ.
- Un départ actif par session, 10 départs/min maximum. Aucun quota quotidien commercial pour cette bêta.
- Trajectoire complète vérifiée : point de départ, vitesse projetée, ralenti hors piste, collisions rayon 7, étoiles dans l’ordre et retour à l’arrivée.
- Durée dérivée de la trace et bornée par l’horloge serveur. Le client ne choisit pas le résultat enregistré.
- Écriture atomique et idempotente : rejouer la requête ne double pas le score.
- Lecture publique top 100 : meilleur tour par Friend, GEN, équipement, période jour/semaine/mois UTC ; rangs 1,1,3 en cas d’égalité.
- Version de règles issue d’un hash du terrain, validateur et moteur. Une nouvelle version ouvre un classement distinct.

RLS sur les quatre tables ; droits des rôles clients révoqués, y compris sur les
fonctions SQL. Seule la fonction Edge utilise la clé de service, fournie par
Supabase dans son environnement. Aucune clé serveur dans Git ou le navigateur.
JWT de passerelle désactivé intentionnellement : l’API applique sa propre
authentification wallet, la lecture du classement étant publique.

## Limites explicites
Les trajectoires synthétiques respectant les règles et les bots restent possibles.
Le temps actif exclut les pauses : cette bêta n’est pas adaptée à des récompenses
financières. Pas de prix, RF réel ou preuve d’activité humaine. Limitation par
wallet/session et taille de requête, mais pas de protection DDoS dédiée. Les anciens
scores restent stockés sous leur version ; une politique d’archivage sera à prévoir.

## Construire et déployer
Depuis la racine, `node scripts/build-sparking-public.mjs` produit `build-public/`.
Le script régénère le validateur serveur et le hash commun avant le bundle navigateur.
Appliquer les migrations avec `supabase db query --linked --file <migration>` puis
`supabase functions deploy sparking-api --project-ref hkudnvqseodizcplkgvw --use-api`.
Les migrations initiales ont été appliquées via Management API, hors historique db push.
Publier les fichiers générés de build-public sur GitHub Pages (gh-pages).
Le build SDK standard reste un aperçu local sans cette extension de classement.

## Vérification
- `node server/test-validation.mjs` : 36 parcours moteur réels, attaques vitesse/téléportation/étoiles.
- `node server/test-public-browser.mjs` : vrai runtime sandboxé, flux de compétition desktop/mobile, service et signature simulés uniquement dans les tests.
- `node server/test-live-api.mjs` : lecture réelle et rejets d’authentification, aucun score ajouté.
- `supabase db query --linked --file supabase/tests/transactions.sql` : tests atomiques réels puis ROLLBACK.
- `supabase db query --linked --file supabase/tests/access-audit.sql` : droits de tables.

La première signature avec un vrai wallet et la publication d’une vraie course
restent une action du joueur. Aucun wallet de joueur n’a été signé par l’agent.

## Persistance Constellations
Migration 003 : comptes de style, inventaire, journal de récompenses par run_id.
RLS et révocation des droits clients sur tables/fonctions. L’API style exige une
session signée et une relecture de propriété pour read/buy/equip.
Le gain est attribué dans la transaction d’acceptation de la course. Verrou par
Friend : cap de trois récompenses/jour, achat atomique et idempotent. Le prix vient
du catalogue SQL, jamais du navigateur. Les déblocages du pass sont automatiques.
Dates de saison fixées côté serveur ; les résultats hors fenêtre ne rapportent rien.
Les résultats existants sont repris dans l’ordre avec protection anti-doublon.
Le style est restauré après la signature de connexion, hors sandbox pour le jeton.
Tests SQL avec rollback : plafond, rejeu, doubles achats, solde, droits, équipement,
isolation par Friend et limites UTC. Tests navigateur : achat et restauration à
1000/390 px. Les balances de test ne sont jamais envoyées au serveur public.
