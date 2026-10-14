# Requirements: Computer Asset Registry

## Asset: Computer

| Field | Type | Required | Notes |
|---|---|---|---|
| id | number | auto | generated (highest id + 1 in Part 1) |
| assetTag | string | yes | unique, case-insensitive, e.g. `PC-0001` |
| brand | string | yes | |
| model | string | yes | |
| serialNumber | string | yes | |
| purchaseDate | date | yes | not in the future |
| status | enum | yes | In use, In stock, Repair, Retired |
| assignedTo | string | no | employee name |
| price | number | yes | greater than 0, in SAR |

## User stories

1. As an admin, I can see an overview of how many computers are in each status.
2. As an admin, I can view all computers in a list with status badges.
3. As an admin, I can add a new computer with validated fields.
4. As an admin, I can edit an existing computer.
5. As an admin, I can delete a computer after confirming.
6. As a user, I can navigate between Home, Computers, Add Computer and About from a menu on every page.
7. As a visitor, I can see the team members (name, student ID) on the About page.

## Pages

| Route | Page | Purpose |
|---|---|---|
| `/` | Home | counts of computers by status |
| `/computers` | AssetList | table with Edit and Delete actions |
| `/add` | AssetForm (add mode) | create |
| `/edit/:id` | AssetForm (edit mode) | update |
| `/about` | About | team members |

A menu is shown on every page, and a footer (course, project name, GitHub link) at the bottom of every page.

## Validation rules

- Required: assetTag, brand, model, serialNumber, purchaseDate, status, price.
- assetTag must be unique (case-insensitive; the computer being edited is ignored).
- purchaseDate cannot be in the future.
- price must be greater than 0.

## Non-functional

- Responsive: the list is a table on wide screens and stacked cards under 900px.
- Light theme only (warm orange and cream).
- Part 1 data lives in memory (React context); no database. Changes reset on reload.
- Part 2 replaces it with a Spring Boot REST API (H2 database):

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/assets` | add |
| GET | `/api/assets/{id}` | find by id |
| GET | `/api/assets?page=&size=` | paginated list |
| PUT | `/api/assets/{id}` | update |
| DELETE | `/api/assets/{id}` | delete (team decision, so the frontend delete keeps working) |
