# SE411 Computer Asset Registry

SE411 (Fall 2026-27) team project: a web app for managing a company's computers (add, view, edit, delete).

- **Part 1:** React frontend, data held in memory (no database).
- **Part 2:** Spring Boot backend and integration (not started yet).

## Team

| Name | Student ID |
|---|---|
| Sarah Alwehaibi | 222411043 |
| Aljoharah Bin Nouh | 222511268 |
| Hatoon Alsolaim | 222511254 |

## Features

- Home page with asset counts by status
- Menu on every page: Home, Computers, Add Computer, About
- List all computers with status badges
- Add and edit computers with form validation (required fields, unique asset tag, no future purchase date, price above 0)
- Delete with confirmation
- About page with the team members
- Responsive layout (table on wide screens, cards on narrow ones)

## Tech stack

React 19, Vite, React Router, Vitest + React Testing Library, oxlint.

## Getting started

Requires Node.js 24 (LTS) or later.

```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
```

Other scripts:

```bash
npm test         # run the test suite once
npm run lint     # lint the code
npm run build    # production build into dist/
```

## Computer fields

`assetTag`, `brand`, `model`, `serialNumber`, `purchaseDate`, `status` (In use / In stock / Repair / Retired), `assignedTo`, `price` (SAR).

## Project structure

```
frontend/src/
├── data/         seed data and status list
├── context/      AssetContext (in-memory state: add, update, delete, get)
├── components/   NavBar
├── pages/        AssetList, AssetForm (add and edit), About
├── utils/        form validation
└── test/         Vitest tests
```
