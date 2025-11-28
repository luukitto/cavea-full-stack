მოგესალმებით კავეას მენეჯმენტის პლატფორმაზე, ვიმედოვნებ სრულყოფილად შევასრულე თქვენი მოთხოვნები, დეტალურ ინსტრუქციას ქვემოთ დავურთავ ინგლისურად(ასე უფრო მეკომფორტულება) მადლობა წინასწარ, პ.ს ლუკა ლობჟანიძე
# Cavea Inventory Management

Full-stack inventory management exercise built with Angular 20, Bootstrap 5, Node.js 22, Express, Sequelize v6, and PostgreSQL. The repository is organized into two standalone apps:

- `frontend/`: Angular client for browsing, filtering, adding, and analyzing inventory.
- `backend/`: Express + Sequelize API backed by PostgreSQL.

## Prerequisites

- Node.js 22 LTS
- npm 10+
- PostgreSQL 14+

## Backend Setup

```bash
cd backend
cp env.example .env
npm install
createdb cavea_inventory  
npm run dev
```

Key scripts:

- `npm run dev` – start the API with live reload.
- `npm run build && npm start` – compile and serve the production build.
- `npm run seed:test-data` – generate up to 500,000 inventory rows (configure via `SEED_RECORDS`, `SEED_BATCH_SIZE`, `SEED_RESET` env vars). This script is deterministic and can be re-run without code changes.

### API Overview

| Method | Endpoint                     | Description                                                  |
| ------ | ---------------------------- | ------------------------------------------------------------ |
| GET    | `/inventories`               | Paginated list (20 per page) with filtering & sorting.       |
| POST   | `/inventories`               | Create an inventory item (`name`, `price`, `locationId`).    |
| DELETE | `/inventories/:id`           | Delete an inventory item.                                    |
| GET    | `/inventories/statistics`    | Per-location totals (count + price sum).                     |
| GET    | `/locations`                 | List of selectable cinema locations.                         |

Filtering happens server-side; sorting supports `name`, `price`, and `location`.

## Frontend Setup

```bash
cd frontend
npm install
npm start 
```

Features:

- Paginated table (20 items/page) with server-driven filtering and sorting.
- Location dropdown backed by the `/locations` endpoint.
- Add-item form with validation on `/add`.
- Statistics page summarizing totals per cinema.
- Delete actions that call the API directly.

Adjust `frontend/src/environments/environment*.ts` if the API runs on a non-default host/port.

## Testing With 500k Records

1. Ensure the database is reachable and the API is stopped.
2. In `backend/.env`, set `SEED_RECORDS=500000` (or another target) and optional `SEED_BATCH_SIZE`.
3. Run `npm run seed:test-data` from `backend/`.
4. Start the API (`npm run dev`) and open the UI. Pagination/navigation remain responsive even with the large dataset.

## Commit Strategy

When committing locally, create meaningful messages that capture incremental progress (e.g., backend scaffolding, API endpoints, Angular UI, docs).

