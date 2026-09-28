<div align="center">

# 🌸 WareWise 🌸

### 🍡 a friendly way to run a warehouse — plan stock, approve orders, forecast demand 🍡

**Pastel on the outside, dependable on the inside.**

</div>

---

## 👉 Try it now

**https://warewise-client.onrender.com/**

That is the only link you need. Taking it for a spin takes a minute:

1. Open the link in any browser — phone or laptop, nothing to install.
2. Sign in with one of the demo accounts below (or create your own account).
3. Click through the whole app — home page, product marketplace, product details,
   ordering, your profile and the sales-prediction chart.

> 🤍 **Tiny note:** if the first page takes about a minute to appear, the demo is just
> waking up. It sleeps when nobody is visiting — reload once and it will be there.

### 🔑 Demo email & password

| Who they are | What they can do | Email | Password |
| --- | --- | --- | --- |
| 🟣 **Supplier** | List products, see who booked them | `johndoe@example.com` | `password123` |
| 🔵 **Employee** | Browse the marketplace, order, see forecasts | `janesmith@example.com` | `password456` |

Five more demo accounts are ready too:

| Email | Password |
| --- | --- |
| `michaeljohnson@example.com` | `password789` |
| `emilydavis@example.com` | `password101` |
| `davidwilson@example.com` | `password102` |
| `sophiamartinez@example.com` | `password103` |
| `danielanderson@example.com` | `password104` |

You can also register a brand-new account from the sign-up screen.

> ⚠️ These logins are public on purpose — please don't keep anything personal in them.

---

## 🤔 What is WareWise, in plain words?

Every business that buys or sells things keeps asking the same three questions:

> *"What do we have, what do we need, and what should we buy next?"*

WareWise answers them in **one shared place**. Suppliers, employees and warehouse
managers all work from the same screen instead of juggling spreadsheets, chats and
paper notes — and a forecasting helper studies past sales to suggest what will
probably be needed next month.

Two rules the product never breaks:

- **People decide, not software.** A forecast is a suggestion; a human still approves it.
- **Everything is recorded.** Deliveries, sales, returns and corrections leave a trace.

---

## 🧁 What can I do in the demo?

- 🏠 **Home** — a quick overview with shortcuts to everything else.
- 🛍️ **Marketplace** — every product suppliers have listed, with prices and stock.
- 📄 **Product details** — a closer look at one item, and the button to order it.
- 📦 **My products** *(suppliers)* — add your own products and see who booked them.
- 👤 **Profile** — update your details and profile picture.
- 📈 **Sales predictions** — a chart estimating demand for the coming months.
- 🙈 **Safe by design** — anything that removes data asks you to confirm first.

---

## 🎯 Who is it for?

| Person | What WareWise does for them |
| --- | --- |
| 🏭 **Suppliers** | Show your products to the businesses that need them — price, stock, availability. |
| 👩‍💼 **Employees** | Find what you need, request it, and see what your warehouse actually uses. |
| 📋 **Warehouse managers** | Watch stock levels, review incoming and outgoing goods, and approve replenishment before anything is ordered. |
| 🧠 **Everyone** | A shared marketplace, stock history, purchase workflows, demand forecasts and payment records. |

### How a purchase flows

1. A supplier adds a product to the marketplace. 🛒
2. An employee or manager finds the product they need. 🔍
3. A purchase request is created and reviewed by the right manager. ✅
4. When the goods arrive, the team records the delivery. 📦
5. Every stock change — delivery, sale, return, transfer, correction — is kept. 🧾
6. The forecasting helper reads past sales and estimates future demand. 🔮
7. A manager reviews the suggestion and makes the final call. 🤍

---

## ✅ What works today — and what is still a demo

**Works end to end in the live demo:**

- Signing in, creating an account and resetting a password
- The product marketplace and product pages
- Ordering and booking products
- Profiles and profile pictures
- The sales-prediction chart

**Still honest-to-goodness demo grade:**

- **Forecasts** come from a simple built-in calculation — an educated guess based on
  recent patterns — not yet a model trained on years of real sales.
- **Payments** are a mock-up: you can walk through the page, but no real money moves.
- **Demo data** lives on free hosting: the database is kept for **30 days**, and the
  site can briefly go offline if the free plan runs out of credits. Treat it as a
  prototype, not a bank.
- **Permissions are still being built**, so demo accounts see a similar view today.

We would rather say this out loud than pretend. 🤍

---

## 💬 Questions people ask

**Do I need to install anything?**  
No. Any browser is enough.

**Does it cost money?**  
No — the demo is free to try.

**Can I break something?**  
Nothing that matters. It runs on demo data and can always be reset.

**It loaded slowly — is it down?**  
It was probably waking up. Free hosting puts the site to sleep after about 15 quiet
minutes; the first page then takes roughly a minute, and everything is quick after that.

**Is the project finished?**  
It is a working prototype with more on the way — see *What works today* above.

**I'm not technical — is this page for me?**  
Yes, and you can stop right here if you like. The nerdy details (architecture, setup
commands, API reference) are folded away at the bottom for the technical team.

---

## 🤝 Contributing

Small, focused changes — one idea at a time. If you change how something behaves,
update the matching document in `docs/` and add tests for the new behaviour.
Guidelines for developers: [CONTRIBUTING.md](CONTRIBUTING.md).

## 🔐 Security

Please don't report security problems as public comments — follow
[SECURITY.md](SECURITY.md) instead. Never put real customer information, passwords
or access keys into this repository.

---

<details>
<summary>🧑‍💻 <b>For the technical team</b> — architecture, status, deployment, local setup, configuration and API reference</summary>

WareWise is a monorepo: a React single-page client, a versioned Node/TypeScript API,
a FastAPI forecasting service, a Solidity payment workspace, a Render Blueprint
deployment file and a Makefile for the local workflow.

## 🗺️ Architecture

```text
   browser 🌸
       │  secure connection (HTTPS)
       ▼
┌────────────────────┐         ┌────────────────────┐
│ client/            │         │ ml-service/        │
│ React + Vite SPA   │         │ FastAPI forecasting│
│ MUI · Redux · wagmi│         │ baseline model     │
└─────────┬──────────┘         └─────────┬──────────┘
          │  VITE_API_BASE_URL           │ ML_SERVICE_URL
          ▼                              │
┌─────────────────────────────────────┐  │
│ server/  Node + TypeScript API      │◄─┘
│ auth · users · products · health    │
│ helmet · CORS · rate limit · metrics│
└───────┬─────────────────────┬───────┘
        │ postgres://         │ redis://
        ▼                     ▼
┌─────────────────┐   ┌─────────────────┐
│ Render Postgres │   │ Render Key Value│
│ system of record│   │ cache · limits  │
└─────────────────┘   └─────────────────┘

      ⛓ foundry/ · Payment.sol (settlement contract)
```

The client talks to the versioned API over HTTPS. The API owns authentication,
authorization, business workflows and persistence. Postgres is the system of record;
Redis-compatible Key Value handles cache, rate-limit state and jobs. Forecasting is
isolated in the ML service, and blockchain access sits behind a backend adapter.
Details: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## 📁 Repository layout

```text
warewise/
├── client/             🎀 React 18 + Vite SPA (MUI, Redux Toolkit, wagmi)
├── server/             🍡 Express API: typed modules in src/, legacy prototype in index.js
├── ml-service/         🔮 FastAPI forecasting service (+ Dockerfile)
├── foundry/            ⛓  Payment.sol workspace (Solidity + Foundry)
├── docs/               📚 Product, API, data, security, ML and deployment specs
├── render.yaml         🚀 Render Blueprint: whole stack in one sync
├── docker-compose.yml  🐳 Local Postgres 16 + Redis 7
└── Makefile            🧰 install · lint · test · build · dev · infra-up
```

## 🧱 Project status

WareWise began as a hackathon prototype and is being rebuilt in stages for real-world
use. Nothing here pretends to be finished: [docs/IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md)
separates what runs from what is planned.

A live instance of the current stack **is** running with the published demo
credentials at the top of this page, and `render.yaml` is the fastest way to review
the whole stack end to end. 🍡

| State | Area |
| --- | --- |
| ✅ **Running** | Typed API foundation (helmet, strict body limit, CORS allowlist, request ids, redacted structured logs, rate limiting, liveness, truthful readiness, metrics) |
| ✅ **Running** | Auth, users and products on the typed API (Prisma + Render Postgres): register/login/password-reset, profiles, paginated marketplace feeds, bookings, demo seed — serving the live demo |
| ✅ **Running** | FastAPI contract foundation (health, readiness, validated single/batch forecasts, baseline recommendations) |
| ✅ **Running** | React client builds with Vite; app shell, router and protected-route composition; zero lint warnings |
| ✅ **Running** | Render Blueprint deployment definition, `GET /api/health`, `0.0.0.0:$PORT` binding, `VITE_API_BASE_URL` plumbing |
| ✅ **Running** | Live Render deployment serving traffic: `warewise-client`, `warewise-api`, `warewise-ml` (Postgres + Key Value provisioned) |
| 🚧 **In progress** | Sessions, RBAC · inventory, orders, payments modules |
| 📅 **Planned** | Object storage · email · blockchain reconciliation · React TypeScript migration · integration & end-to-end tests · trained forecasting models |

---

## 🚀 Deployment

One blueprint file — [`render.yaml`](render.yaml) — provisions the whole monorepo
(client, API, forecasting service, Postgres and Key Value) and wires them together:

| Resource | Kind | Root | Health check |
| --- | --- | --- | --- |
| `warewise-client` | Static site (global CDN) | `client/` | – (`/*` rewrites to `/index.html`) |
| `warewise-api` | Node web service, free plan | `server/` | `GET /api/health` |
| `warewise-ml` | Python web service, free plan | `ml-service/` | `GET /health` |
| `warewise-db` | Render Postgres 16, internal-only | – | – |
| `warewise-cache` | Render Key Value (Redis-compatible) | – | – |

To deploy: open the Render dashboard → **New + → Blueprint** → pick this repository
(or a specific branch) and sync. Notes on ports, environment wiring and free-tier
limits live in [docs/DEPLOYMENT_SPEC.md](docs/DEPLOYMENT_SPEC.md).

**Wiring, automatically**

- `DATABASE_URL` ← `fromDatabase` (internal connection string for the database's region)
- `REDIS_URL` ← `fromService` on the Key Value instance (`connectionString`)
- `ML_SERVICE_URL` ← `fromService` on the ML service (`host`); the API adds the scheme
  (secure HTTPS for public hosts, plain HTTP for undotted private addresses)
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` ← generated on the first sync, then preserved
- Both services bind `0.0.0.0` and read the port the platform injects (`PORT` for Node,
  `$PORT` for uvicorn), so health checks and zero-downtime deploys behave
- Pushes to `main` redeploy automatically (`autoDeployTrigger: commit`)

**Free-plan reality check 🤍**

- Free web services **spin down after 15 minutes idle** — the next request pays a cold
  start of about a minute.
- Free web services can *send* but not *receive* private-network traffic, so the API
  reaches the ML service over its public address. Upgrade both and switch
  `warewise-ml` to `type: pserv` to use the private address (noted inline in `render.yaml`).
- Free Postgres **expires 30 days after creation** and has no backups or managed pooling.
- Free Key Value is in-memory only and may restart without notice.
- Free instances are perfect for a demo or a review — upgrade before real traffic. 💸

## 🍃 Local development

**You need:** Node.js 22+, npm, Python 3.12+, Docker.

```sh
# 1 · datastores (Postgres 16 + Redis 7)          → make infra-up
docker compose up -d postgres redis

# 2 · dependencies                                → make install
npm install --prefix server
npm install --prefix client

# 3 · the web app                                 → open localhost:5173
npm run dev --prefix client

# 4 · the typed API                               → port 6001
npm run build:typed --prefix server
npm run start:typed --prefix server
#   (npm run dev --prefix server starts the legacy prototype instead; it needs MONGO_URL)

# 5 · the forecasting service                     → port 8000
python -m venv .venv
.venv\Scripts\Activate.ps1              # Windows PowerShell
source .venv/bin/activate               # macOS / Linux
pip install -r ml-service/requirements.txt
python -m uvicorn app.main:app --app-dir ml-service --host 0.0.0.0 --port 8000
```

Copy `.env.example`, `server/.env.example` and `client/.env.example` into local `.env`
files before starting the API. Never commit real passwords, keys or `.env` files. 🔐

## ⚙️ Configuration

| Variable | Service | Notes |
| --- | --- | --- |
| `PORT` | API, ML | Injected by the platform (Render sets it). Locally the API falls back to `API_PORT`. |
| `API_PORT` | API | Local default `6001`. |
| `HOST` | API | Defaults to `0.0.0.0` so containers and health checks can reach it. |
| `DATABASE_URL` | API | Postgres connection string; `fromDatabase` on Render. |
| `REDIS_URL` | API | Redis-compatible URL; `fromService` on Render. |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | API | Required when `NODE_ENV=production`; generated by the Blueprint. |
| `ML_SERVICE_URL` | API | Base URL of the forecasting service; the scheme is inferred when Render omits it. |
| `CORS_ORIGINS` | API | Comma-separated browser origin allowlist. |
| `VITE_API_BASE_URL` | Client | Build-time API origin (`client/src/config/api.js`), defaults to `localhost:6001`. |
| `PYTHON_VERSION` | ML | Fully qualified version required by the Render Python runtime. |

## 🩺 Endpoints

**Typed API** — `server/` (deployed as `warewise-api`; the browser reaches it through
`VITE_API_BASE_URL`):

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | `200` liveness — the Render health check target |
| `GET` | `/health` · `/api/v1/health` | Liveness (plain and versioned) |
| `GET` | `/ready` | Dependency readiness; `503` until Postgres and Redis are configured |
| `GET` | `/metrics` | Prometheus-style plain-text metric |
| `POST` | `/auth/register` · `/auth/login` | Demo registration and sign-in (multipart avatar, JWT) |
| `POST` | `/auth/verify-email` · `/auth/reset-password-security` | Forgot-password flow |
| `GET`·`PATCH` | `/users/:id` | Profile read/update (Bearer token) |
| `GET` | `/products` · `/products/:userId/products` · `/products/:userId/bookedproducts` | Paginated feeds |
| `GET`·`POST`·`PATCH`·`DELETE` | `/products/:productId/…` | Detail, create, booking toggle, delete |
| `GET` | `/assets/*` | Avatars (uploaded bytes or generated initials SVG) |
| `GET` | `/predictMonthly?month&year` | Monthly forecast series (proxies `warewise-ml`, falls back locally) |

**Forecasting service** — `ml-service/` (deployed as `warewise-ml`, private to the API):
`GET /health`, `GET /ready`, `POST /api/v1/forecast`, `POST /api/v1/forecast/batch`,
`GET /api/v1/forecast/{productId}`. Contract: [docs/ML_SPEC.md](docs/ML_SPEC.md).

**Legacy prototype** — `server/index.js` (Mongoose + MongoDB, requires `MONGO_URL`; not
deployed — its route shapes now live on the typed API above).

## 🧪 Quality gates

```sh
make install      # npm install for client + server
make lint         # client eslint — passes with zero warnings
make test         # tsc build + node:test API suite (health, /api/health, readiness, metrics)
make build        # vite production build
make infra-up     # docker compose up -d postgres redis
make infra-down   # docker compose down
```

Every pull request should pass install, lint, typecheck, tests and build for the
packages it touches — see [CONTRIBUTING.md](CONTRIBUTING.md). 💅

## 📚 Documentation

| Doc | What's inside |
| --- | --- |
| [Product overview](docs/PRODUCT_SPEC.md) | Who WareWise is for and what it promises |
| [Architecture](docs/ARCHITECTURE.md) | Topology, boundaries and the request path |
| [Database design](docs/DATABASE_SCHEMA.md) | Entities, invariants and migrations |
| [API design](docs/API_SPEC.md) | Endpoints, auth, pagination and error shape |
| [Forecasting](docs/ML_SPEC.md) | Forecast contracts and model expectations |
| [Blockchain](docs/BLOCKCHAIN_SPEC.md) | Payment settlement requirements |
| [Security](docs/SECURITY_SPEC.md) | Auth, secrets, logging and incident rules |
| [Deployment](docs/DEPLOYMENT_SPEC.md) | Environments, Render Blueprint, delivery gates, observability |
| [Implementation status](docs/IMPLEMENTATION_STATUS.md) | What runs, what is planned, and the decisions still needed |

</details>

---

<div align="center">

### ・:\*:・ 🌸 thank you for stopping by 🌸 ・:\*:・

**WareWise** — count the boxes, keep the humans in charge.

Try the demo: **https://warewise-client.onrender.com/**

[⬆ back to the top](#-warewise-)

</div>
