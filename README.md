# Portfolio — Axel KAMGAING KOM

Portfolio statique en français construit avec Astro et TypeScript. La direction visuelle est une identité éditoriale cyber-operations sombre, avec accent signal orange/corail, une navigation clavier et des schémas SVG originaux.

## Architecture

```text
src/
├── components/          # En-tête, pied de page, schéma projet
├── data/projects.ts     # Source typée des 7 études de cas
├── layouts/             # Layout SEO, thèmes, transitions
├── pages/               # Routes Astro et RSS
└── styles/global.css    # Tokens, composants, responsive, print
public/                  # Favicons, OpenGraph, manifest, JS progressif
```

Le site est entièrement pré-rendu. Les pages projet sont générées depuis `src/data/projects.ts`. Aucun contenu distant n’est requis au rendu. Les polices sont empaquetées localement via Fontsource.

## Développement local

Prérequis : Node.js 22+ et npm.

```bash
npm ci
npm run dev
```

Ouvrir `http://localhost:4321`.

## Qualité, tests et build

```bash
npm run lint       # ESLint JS, TypeScript et Astro
npm run check      # diagnostics Astro/TypeScript
npm run test       # invariants sur le build généré
npm run build      # check + build statique dans dist/
npm run preview    # prévisualisation de dist/
```

## Docker

```bash
docker compose up --build
curl http://localhost:8080/healthz
```

L’image multi-stage compile le site puis le sert avec nginx. La route `/healthz` alimente le `HEALTHCHECK`.

## Déploiement

Le répertoire `dist/` peut être publié sur tout hébergement statique. Pour un serveur conteneurisé, utiliser `Dockerfile`, `nginx.conf` et `docker-compose.yml`. La CI GitHub exécute lint, tests, build et construction de l’image, sans déploiement automatique.

Avant publication :

1. compléter l’hébergeur dans `/mentions-legales/` ;
2. vérifier que le formulaire Formspree `xovdokao` appartient toujours à l’éditeur ;
3. servir le site en HTTPS sur `komjordan.fr` ;
4. contrôler les liens et le rendu sur les navigateurs cibles.

## Accessibilité et interactions

- navigation sémantique, lien d’évitement et focus visibles ;
- palette de commande avec `Ctrl/⌘ K`, flèches, Entrée et Échap ;
- thème clair/sombre mémorisé, menu mobile et filtres accessibles ;
- mouvement discret désactivé par `prefers-reduced-motion` ;
- styles d’impression dédiés.

## Licence et droits

Le **code source** est distribué sous licence MIT (voir `LICENSE`). Les **textes, études de cas, diagrammes, nom, identité et éléments de marque** sont © Axel KAMGAING KOM et restent réservés. La licence MIT ne s’applique pas à ces contenus.
