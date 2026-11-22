# ShopLedger working notes

## Stack and commands

- Node.js with CommonJS modules and Express 4.
- Start the app with `npm start` (or `node server.js`); the default URL is `http://localhost:3000`.
- Run tests with `node --test`.
- The repository currently has no declared test script or test dependencies. Prefer Node's built-in `node:test` and `node:assert` modules.
- `npm install` installs the dependencies in `package.json` and creates `package-lock.json`; do not commit that generated lockfile for this workshop.

## Module map

- `server.js` serves `public/`, mounts the routers in `routes/`, and renders printable invoices through `lib/invoice.js`.
- `public/index.html`, `public/js/app.js`, and `public/css/style.css` implement the browser UI.
- `routes/products.js` serves catalog and coupon data; `routes/orders.js` handles order reads, placement, and cancellation; `routes/customers.js` handles customer and settlement requests; `routes/reports.js` serves dashboard, reconciliation, and price-preview requests.
- `lib/inventory.js`, `lib/pricing.js`, `lib/coupons.js`, and `lib/tax.js` handle stock and checkout calculations.
- `lib/orders.js`, `lib/ledger.js`, and `lib/dates.js` handle order records, customer credit, settlements, and date normalization.
- `lib/invoice.js` calculates and renders printable invoice HTML; `lib/reports.js` builds dashboard and GST reconciliation data; `lib/store.js` reads and writes the JSON database.
- `config.js` contains tax slabs, coupons, shop metadata, and the port. `data/db.json` is the tracked seed database.

## Workshop rules

- Write characterization tests before changing behavior.
- Change only the module the selected ticket is about, plus its tests and required documentation.
- Tests must use in-memory data and must never read or write `data/db.json`.
- Do not add dependencies.
- Do not run the app's write operations against the tracked `data/db.json`.
