# Frontend

React frontend for the SE411 Computer Asset Registry. Data comes from the Spring Boot backend at `http://localhost:8080/api/assets`, so start the backend (`mvn spring-boot:run` in `backend/`) before using the app. The backend keeps data in memory (H2), so it resets when the backend restarts.

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
├── data/         status list
├── context/      AssetContext: REST calls (load, add, update, delete) plus loading and error state
├── components/   NavBar, Footer
├── pages/        Home, AssetList, AssetForm (add and edit), About
├── utils/        validate.js (form validation)
└── test/         Vitest + React Testing Library tests
```

Components read and change data only through the `useAssets()` hook; `AssetContext.jsx` is the only file that calls the backend. The tests mock `fetch`, so `npm test` does not need the backend running.

See the [root README](../README.md) for the team, features and tech stack.
