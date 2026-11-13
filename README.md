# Pareglass Auto — site vitrine

Site [Astro 5](https://astro.build) + Tailwind CSS 4. Toutes les pages sont statiques ; seule la route `/api/vehicule` (identification par la plaque) tourne côté serveur, pour garder la clé API secrète.

## Démarrer

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # vérification des types + génération dans dist/
npm run preview   # sert le build
npm start         # serveur de production Node (port 4321)
npm test          # tests unitaires (Vitest)
npm run format    # Prettier (Astro + tri des classes Tailwind)
```

## À compléter avant la mise en ligne

Tout se trouve dans **`src/config/site.ts`** (les champs vides sont masqués du site) :

- adresse complète de l’atelier (le « 181 » est repris de la façade), coordonnées GPS ;
- villes desservies pour l’intervention à domicile ;
- raison sociale, SIRET, e-mail ;
- lien de la fiche Google Business.

Variables d’environnement (voir `.env.example`) :

| Variable               | Rôle                                                                                                           |
| ---------------------- | -------------------------------------------------------------------------------------------------------------- |
| `SITE_URL`             | Domaine définitif : balises canonical, sitemap, Open Graph.                                                    |
| `PUBLIC_FORM_ENDPOINT` | URL Formspree / Web3Forms / Getform. Vide : le formulaire de devis ouvre WhatsApp avec la demande pré-remplie. |

## Identification du véhicule par la plaque

Comme sur Oscaro ou Autodoc : le client tape sa plaque, la marque, le modèle, la motorisation et la date de mise en circulation s’affichent, et sont joints à la demande de devis.

- **Sans clé API**, la fonction est désactivée : le client saisit marque et modèle à la main. Pour tester l’affichage sans abonnement, `PLATE_API_PROVIDER=mock` renvoie des véhicules **fictifs**, signalés comme tels à l’écran et jamais joints au devis (les plaques en `ZZ-…` simulent une plaque inconnue).
- **En production**, il faut un abonnement à une API SIV. Le connecteur fourni vise [apiplaqueimmatriculation.com](https://apiplaqueimmatriculation.com) : renseigner `PLATE_API_TOKEN`. Pour un autre fournisseur, ajouter un connecteur dans `src/lib/vehicle/providers.ts` (une fonction qui renvoie une fiche `Vehicle`).
- Au premier essai avec un vrai jeton, lancer avec `PLATE_API_DEBUG=1` et comparer la réponse brute au mapping : les noms de champs peuvent varier d’une version de l’API à l’autre.
- Protections : clé jamais envoyée au navigateur, appels refusés depuis un autre site, 15 recherches par IP toutes les 10 minutes, cache de 7 jours (une plaque déjà cherchée ne coûte plus de crédit), VIN et données du titulaire jamais renvoyés.
- Si l’API est absente ou en panne, le site fonctionne normalement : le client indique simplement la marque et le modèle à la main.

### Hébergement

L’adaptateur `@astrojs/node` produit un serveur Node (`npm start`), pour un VPS, o2switch, Render, Railway… Pour Netlify, Vercel ou Cloudflare, remplacer l’adaptateur dans `astro.config.mjs` par `@astrojs/netlify`, `@astrojs/vercel` ou `@astrojs/cloudflare` : rien d’autre à changer.

## Structure

```
src/
  config/site.ts        infos entreprise, assureurs, marques
  data/services.ts      contenu des 5 pages prestations (texte, FAQ, points clés)
  components/           Logo (SVG redessiné), champ plaque FR, diagnostic impact, FAQ…
  pages/
    index.astro
    [service].astro     génère les 5 pages prestations depuis data/services.ts
    assurance-franchise-offerte.astro
    intervention-a-domicile.astro
    devis.astro
    mentions-legales.astro, confidentialite.astro, 404.astro, robots.txt.ts
  pages/api/vehicule.ts route serveur : plaque → fiche véhicule
  lib/plate.ts          validation et mise en forme des plaques (SIV et FNI)
  lib/vehicle/          fournisseurs d’API, cache, limitation de débit
tests/                  tests Vitest
scripts/icons.mjs       régénère les favicons PNG depuis public/favicon.svg
```

## SEO

- Données structurées `AutoRepair` (horaires, téléphone, adresse, catalogue de prestations), `Service`, `FAQPage`, `BreadcrumbList`.
- Une page par prestation avec titre et description dédiés ; le nom de la ville est ajouté automatiquement aux titres une fois renseigné.
- Sitemap et robots.txt générés au build ; images converties en WebP et redimensionnées ; HTML/CSS/JS compressés.
