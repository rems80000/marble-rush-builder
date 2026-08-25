# public/pieces/

Placez ici les images statiques de vos pièces Marble Rush.

Convention de nommage : `<CODE>.webp` ou `<CODE>.png` ou `<CODE>.jpg`

Exemples :
- `T-04.webp`
- `M-03.png`
- `B-01.jpg`
- `MARBLE.webp`

Ces images sont servies comme assets statiques et utilisées en priorité par le composant `PieceImage`
si aucune image uploadée n'est trouvée dans IndexedDB.

Les uploads via l'interface (page "Photos des pièces") sont stockés en IndexedDB et ont priorité sur ces fichiers.
