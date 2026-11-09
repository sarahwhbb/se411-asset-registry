# Requirements: Computer Asset Registry

## Asset: Computer

| Field | Type | Required | Notes |
|---|---|---|---|
| id | number | auto | generated (highest id + 1 in Part 1) |
| assetTag | string | yes | unique, case-insensitive, surrounding spaces ignored, e.g. `PC-0001` |
| brand | string | yes | |
| model | string | yes | |
| serialNumber | string | yes | |
| purchaseDate | date (`YYYY-MM-DD`) | yes | not in the future (today is allowed) |
| status | enum | yes | In use, In stock, Repair, Retired |
| assignedTo | string | no | employee name |
| price | number | yes | greater than 0 (decimals allowed), in SAR |

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

Any other URL shows "Page not found". `/edit/:id` with an id that does not exist shows "Computer not found" with a link back to the list.

A menu is shown on every page, and a footer (course, project name, GitHub link) at the bottom of every page.

## Acceptance criteria

**Home (`/`)**

- Shows the total number of computers and one count per status (In use, In stock, Repair, Retired).
- The status counts add up to the total, and match the data after any add, edit or delete.
- Has links to the list (View computers) and to the add form.

**List (`/computers`)**

- Shows one row per computer with tag, brand, model, serial number, purchase date, status badge, assigned to, price and the Edit and Delete actions.
- An empty assignedTo is shown as "—".
- When there are no computers, the message "No computers registered yet." is shown instead of the table.
- Delete asks for confirmation. Confirming removes the computer; cancelling leaves the list unchanged.
- Under 900px each row is shown as a stacked card with a label before each value.

**Add (`/add`)**

- All required fields are marked with `*`; status defaults to "In stock".
- Submitting with invalid values keeps the form open and shows an error under each invalid field; nothing is added.
- Submitting valid values adds the computer with the next id (highest id + 1), trims the text fields, stores price as a number, and returns to `/computers`.

**Edit (`/edit/:id`)**

- The form opens with the current values of that computer.
- A computer can be saved with its own asset tag unchanged, in any letter case.
- Changing the tag to one used by another computer is rejected.
- Saving updates that computer only (its id never changes) and returns to `/computers`.

**About (`/about`)**

- Lists every team member with name and student ID, and has its own menu item.

**Navigation**

- The menu (Home, Computers, Add Computer, About) and the footer are visible on every page, and the menu highlights the current page.

## Validation rules

- Required: assetTag, brand, model, serialNumber, purchaseDate, status, price. A value with only spaces counts as empty.
- assetTag must be unique (case-insensitive; the computer being edited is ignored).
- purchaseDate cannot be in the future.
- status must be one of In use, In stock, Repair, Retired.
- price must be a number greater than 0. An empty or non-numeric price is reported as required.
- assignedTo is optional.

| Field | Error message |
|---|---|
| assetTag | Asset tag is required / Asset tag must be unique |
| brand | Brand is required |
| model | Model is required |
| serialNumber | Serial number is required |
| purchaseDate | Purchase date is required / Purchase date cannot be in the future |
| status | Choose a valid status |
| price | Price is required / Price must be greater than 0 |

## Non-functional

- Responsive: the list is a table on wide screens and stacked cards under 900px.
- Light theme only (warm orange and cream).
- Part 1 kept data in memory (React context). In Part 2 the data lives in the Spring Boot backend (in-memory H2), so it resets when the backend restarts and the list starts empty.
- Tests: `npm test` in `frontend/` must pass (Vitest + React Testing Library).
- Part 2 replaces it with a Spring Boot REST API (H2 database):

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/assets` | add |
| GET | `/api/assets/{id}` | find by id |
| GET | `/api/assets?page=&size=` | paginated list |
| PUT | `/api/assets/{id}` | update |
| DELETE | `/api/assets/{id}` | delete (team decision, so the frontend delete keeps working) |
