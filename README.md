# Le Flan Pâtissier — jeux

Mini-jeux web autour de la pièce *Le Flan Pâtissier* d'Étienne Bennequin (Compagnie de la Toque Flamboyante).
Distribués au Festival d'Avignon 2026.

## Jeux disponibles

- **La Chasse au Flan** (`chasse-au-flan.html`) — Mini-jeu type *Where's Wally* : trouve le 🍮 caché dans la foule en 12 manches contre la montre. 3 modes de difficulté (Débuflan / Mi-flan / Hardcôt). Pensé mobile pour distribution sur place.
- **Le Génie Gentil** (`niveau-5.html`) — Aventure narrative / point-and-click avec dialogue à choix, jauges *estime / suspicion / charge machine* et 4 fins possibles.
- **Le Flan Anonyme** (`niveau-2.html`) — Niveau narratif 5 tours, scène d'appartement parisien.
- **La Machine de Loulou** (`niveau-loulou.html`) — Arcade Reigns-like : maintiens les 4 jauges psychiques (Aspiration / Production / Estime / Joie) entre 20 et 80%.

## Lancer

Tout est statique. Double-clic sur `index.html` ouvre le hub, ou en CLI :

```bash
open index.html
```

## Stack

HTML + CSS + JavaScript natifs (pas de build). Audio synthétisé via Web Audio API. Sauvegardes en `localStorage`.
