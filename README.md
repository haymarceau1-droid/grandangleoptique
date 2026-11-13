# Grand Angle Optique

Site statique de l'opticien Grand Angle Optique (Angers). Pas de build : on envoie les fichiers tels quels sur l'hébergement.

## Fichiers

- `*.html` : une page par fichier. L'en-tête et le pied de page sont répétés dans chaque page.
- `style.css` : toute la mise en forme. Les couleurs et les espacements sont des variables en haut du fichier.
- `script.js` : menu mobile, diaporama de l'accueil, apparition au défilement, formulaire, bannière de cookies, statut ouvert/fermé.
- `assets/` : logo, polices (hébergées sur le site), photos en WebP, icônes (Lucide, licence ISC).
- `.htaccess`, `robots.txt`, `sitemap.xml` : hébergement Apache (o2switch), redirections des anciennes URL, référencement.

## À modifier à la main

- **Horaires** : dans le pied de page de chaque page, dans le tableau de `contact.html` et de l'accueil, et dans `script.js` (créneaux `slots`, jours `openDay`).
- **Adresse e-mail du formulaire** : `contact@grandangleoptique.fr` dans `script.js` et dans les `action` des formulaires.
- **Mentions légales** : SIRET, forme juridique et hébergeur à compléter dans `mentions-legales.html`.

## Mise en ligne

Copier tous les fichiers dans `public_html`. Vérifier que la règle « badbots » de TigerProtect (cPanel) ne bloque pas les visiteurs légitimes.
