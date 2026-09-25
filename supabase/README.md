# Serveur de classement — travail en cours

Projet cible : hkudnvqseodizcplkgvw (sparking-stars-beta).
Migration appliquée au projet cible le 26 septembre 2026 via Supabase CLI (Management API).
Aucune clé serveur ne doit entrer dans le bundle public ou dans Git.

## Flux prévu avant ouverture de l’écriture
1. Challenge unique signé explicitement par le wallet dans le conteneur fiable.
2. Vérification de la signature, du domaine, de l’expiration et de l’usage unique.
3. Session courte conservée en mémoire ; jeton haché dans la base.
4. Départ délivré par le serveur, GEN/propriété relues sur Robinhood.
5. Parcours contrôlé : départ, étoiles dans l’ordre, collisions, vitesse, durée.
6. Consommation atomique du départ et insertion unique du résultat.
7. Lecture publique filtrée par GEN, équipement, version des règles et période UTC.

Les contrôles de trajectoire ne constituent pas une preuve qu’un humain joue :
bots et trajectoires synthétiques plausibles restent un risque. Aucune récompense
financière ni promesse de classement inviolable durant cette bêta.

## État
- Quatre tables créées ; RLS activée. Aucun score enregistré.
- Vérification distante : anon/authenticated sans INSERT ni UPDATE ; service_role autorisé.
- Supabase CLI connecté et projet lié ; secrets non inclus dans Git.
- Authentification serveur, validation et raccordement du jeu à implémenter.
- Le classement public actuel reste un tableau local de session.
