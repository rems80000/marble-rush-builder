# Marble Rush Builder 🔮

Application web / PWA pour gérer vos circuits VTech Marble Rush.

## Fonctionnalités

- **Mes Sets** — catalogue de vos sets avec pièces, couleurs, quantités
- **Inventaire** — vue fusionnée des pièces disponibles selon les sets actifs
- **Générateur** — crée un circuit étape par étape selon vos contraintes (difficulté, taille, priorités, âge)
- **Plans** — bibliothèque des circuits générés, sauvegardés et favoris
- **Modules** — blocs réutilisables (spirale, ascenseur, tour, flipper…)
- **Paramètres** — thème, import/export JSON, stats

## Stack technique

- React 19 + Vite + TypeScript
- Tailwind CSS v4
- React Router DOM v7
- Stockage localStorage (hors-ligne natif)
- PWA via vite-plugin-pwa (Workbox)
- Déploiement GitHub Pages

## Développement

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build de production
npm run build

# Prévisualiser le build
npm run preview
```

## Déploiement GitHub Pages

```bash
# Crée le build et publie sur la branche gh-pages
npm run deploy
```

L'application sera disponible sur :
`https://<votre-username>.github.io/marble-rush-builder/`

## Configuration GitHub Pages

1. Créer un repo GitHub `marble-rush-builder`
2. Pousser le code : `git push origin main`
3. Lancer : `npm run deploy`
4. Dans les paramètres du repo → Pages → Source : branche `gh-pages`

## Données

Toutes les données sont stockées localement dans le navigateur (localStorage).
Utilisez **Paramètres → Exporter** pour sauvegarder vos données en JSON.
Le fichier peut être réimporté sur n'importe quel appareil.

## Structure du projet

```
src/
├── components/       # Composants réutilisables
│   ├── Navigation.tsx
│   ├── PieceCard.tsx
│   ├── SetCard.tsx
│   ├── StepByStepViewer.tsx
│   ├── BuildGrid.tsx
│   └── ValidationPanel.tsx
├── data/
│   └── seedData.ts   # Sets et modules d'exemple
├── pages/
│   ├── Home.tsx
│   ├── MySets.tsx
│   ├── Inventory.tsx
│   ├── Generator.tsx
│   ├── Plans.tsx
│   ├── Modules.tsx
│   └── Settings.tsx
├── store/
│   └── useStore.ts   # État global (Context + useReducer + localStorage)
├── types/
│   └── index.ts      # Types TypeScript complets
└── utils/
    └── storage.ts    # localStorage, import/export, helpers
```
