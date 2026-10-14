# Frontend

React frontend for the SE411 Computer Asset Registry. Data is held in memory (no backend yet), so changes reset on page reload.

## Scripts

Run these in this folder (`frontend/`):

```bash
npm install
npm run dev         # dev server at http://localhost:5173
npm test            # run the Vitest suite once
npm run test:watch  # Vitest in watch mode
npm run lint        # oxlint
npm run build       # production build into dist/
npm run preview     # serve the production build locally
```

## Routes

| Path | Page |
|---|---|
| `/` | Home (asset counts by status) |
| `/computers` | Computer list (table on wide screens, cards under 900px) |
| `/add` | Add a computer |
| `/edit/:id` | Edit a computer |
| `/about` | Team members |

## Structure

```
src/
├── data/         seed computers and status list
├── context/      AssetContext: in-memory state (add, update, delete, get)
├── components/   NavBar, Footer
├── pages/        Home, AssetList, AssetForm (add and edit), About
├── utils/        validate.js (form validation)
└── test/         Vitest + React Testing Library tests
```

Components read and change data only through the `useAssets()` hook, so switching to a REST backend later means changing `AssetContext.jsx` only.

See the [root README](../README.md) for the team, features and tech stack.
