<div align="center">

# 🌸 WareWise 🌸

### ✧ supply chain & warehouse management with a forecasting brain ✧

**Pastel on the outside, typed and tested on the inside.**

[![Node.js](https://img.shields.io/badge/Node.js-22.x-3C873A?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Redis](https://img.shields.io/badge/Redis%20Key%20Value-Valkey%208-DC382D?style=flat-square&logo=redis&logoColor=white)](https://render.com/docs/key-value)
[![Solidity](https://img.shields.io/badge/Solidity-Foundry-363636?style=flat-square&logo=solidity&logoColor=white)](https://book.getfoundry.sh)
[![Render](https://img.shields.io/badge/Render-Blueprint-46E3B7?style=flat-square&logo=render&logoColor=white)](render.yaml)
[![Vibes](https://img.shields.io/badge/vibes-pastel%20%E2%9C%A8-FFB6C1?style=flat-square)](#-project-status)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/sillyfellow21/WareWise-AI)
[![Live demo](https://img.shields.io/badge/live-demo-46E3B7?style=flat-square&logo=render&logoColor=white)](https://warewise-client.onrender.com)

</div>

> ・:\*:・ *"What do we have, what do we need, and what should we buy next?"* ・:\*:・

WareWise brings **suppliers, employees, warehouse managers, sales history and payment
records** into one tidy place. Stock levels, approvals and demand forecasts live behind
one API, so a person — never a robot — stays in charge of every big decision.

Forecasts are recommendations, not automatic orders. 🌱

<div align="center">

| 🧁 | 🌸 | 🍡 |
| --- | --- | --- |
| plan stock | approve orders | forecast demand |

</div>

---

## 🌍 Live demo

| 🖱️ | Open | What you'll get |
| --- | --- | --- |
| 🎀 **App** | **<https://warewise-client.onrender.com>** | The deployed React UI — the login screen is the first thing you'll see |
| 🌷 **API** | <https://warewise-api.onrender.com/api/health> | Typed API liveness (`200 ok`) |
| 📊 **Readiness** | <https://warewise-api.onrender.com/ready> | `database` / `redis` wiring status |
| 📏 **Metrics** | <https://warewise-api.onrender.com/metrics> | Prometheus-style plain text |
| 🔮 **Forecasting** | <https://warewise-ml.onrender.com/health> | ML service liveness |

> 🤍 **Honest status label:** the deployment is real — every link above answers right
> now (allow about a minute if the free tier has been idle). What it does *not* do yet:
> the SPA still points its sign-in, registration and marketplace calls at the retired
> hackathon backend, so **login flows will not complete**. Auth, users and products on
> the typed API are the in-progress milestone
> ([docs/IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md)). A visitor can click
> through the deployed UI and inspect live health, readiness, metrics and forecast
> endpoints today.

---

## ✨ Why WareWise

| Role | What they get |
| --- | --- |
| 🏭 **Suppliers** | List products, share prices and availability, become visible to the businesses that need them. |
| 🧑‍💼 **Employees** | Browse the marketplace, request items, track what their warehouse actually uses. |
| 📋 **Warehouse managers** | Watch stock levels, review incoming and outgoing movements, approve replenishment before anything is ordered. |
| 💜 **Everyone** | A shared product marketplace, inventory history, purchase workflows, demand forecasts and payment records with optional blockchain settlement. |

### How it flows

1. A supplier adds a product to the marketplace. 🛒
2. An employee or manager finds the product they need. 🔍
3. A purchase request is created and reviewed by the right manager. ✅
4. When stock arrives, the team records the delivery. 📦
5. Every stock change — delivery, sale, return, transfer, adjustment — is kept. 🧾
6. The forecasting service reads historical sales and estimates future demand. 🔮
7. A manager reviews the recommendation and decides. 🫶

---

## 🗺️ Architecture

```text
      browser  🌸
         │  https
         ▼
 ┌───────────────────────┐        ┌──────────────────────────────┐
 │ client/  (React + CDN)│        │ ml-service/  (FastAPI)       │
 │ Vite · MUI · Redux    │        │ /api/v1/forecast{,/batch}    │
 │ TanStack Query · wagmi│        │ deterministic baseline model │
 └──────────┬────────────┘        └──────────────▲───────────────┘
            │  VITE_API_BASE_URL                 │ ML_SERVICE_URL
            ▼                                    │
 ┌───────────────────────────────────────────────┴──────────────┐
 │ server/  (Node + TypeScript API)                             │
 │ helmet · CORS allowlist · request ids · rate limit · metrics │
 │ auth · inventory · orders · payments (modules in progress)   │
 └───────┬─────────────────────────────┬────────────────────────┘
         │ postgres://                  │ redis://
         ▼                              ▼
 ┌──────────────────────┐      ┌────────────────────────┐
 │ Render Postgres  🐘  │      │ Render Key Value  🍒  │
 │ system of record     │      │ cache · queues · limits│
 └──────────────────────┘      └────────────────────────┘

         ⛓️  foundry/  ·  Payment.sol — contract workspace for payment settlement
```

The client talks to the versioned API over HTTPS. The API owns authentication,
authorization, business workflows and persistence. Postgres is the system of record;
Redis-compatible Key Value handles cache, rate-limit state and jobs. Forecasting is
isolated in the ML service, and blockchain access sits behind a backend adapter.
Details: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## 📁 Repository layout

```text
warewise/
├── client/          🎀 React 18 + Vite SPA (MUI, Redux Toolkit, wagmi)
├── server/          🌷 Express API: typed modules in src/, legacy prototype in index.js
├── ml-service/      🔮 FastAPI forecasting service (+ Dockerfile)
├── foundry/         ⛓️  Payment.sol workspace (Solidity + Foundry)
├── docs/            📚 Product, API, data, security, ML and deployment specs
├── render.yaml      🚀 Render Blueprint: whole stack in one sync
├── docker-compose.yml  🐳 Local Postgres 16 + Redis 7
└── Makefile         🧰 install · lint · test · build · dev · infra-up
```

## 🧸 Project status

WareWise began as a hackathon prototype and is being rebuilt in stages for real-world
use. Nothing here pretends to be finished: [docs/IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md)
separates what runs from what is planned.

There is no complete hosted production version yet, and the credentials from the old
prototype have been removed from the repository for security. A live instance of the
current stack **is** running — see [🌍 Live demo](#-live-demo) — and the Render Blueprint
above is the fastest way to review the current stack end to end. 🌷

| State | Area |
| --- | --- |
| ✅ **Running** | Typed API foundation (helmet, strict body limit, CORS allowlist, request ids, redacted structured logs, rate limiting, liveness, truthful readiness, metrics) |
| ✅ **Running** | FastAPI contract foundation (health, readiness, validated single/batch forecasts, baseline recommendations) |
| ✅ **Running** | React client builds with Vite; app shell, router and protected-route composition; zero lint warnings |
| ✅ **Running** | Render Blueprint deployment definition, `GET /api/health`, `0.0.0.0:$PORT` binding, `VITE_API_BASE_URL` plumbing |
| ✅ **Running** | Live Render deployment serving traffic: `warewise-client`, `warewise-api`, `warewise-ml` (Postgres + Key Value provisioned) |
| 🚧 **In progress** | PostgreSQL/Prisma schema and migrations · auth, sessions, RBAC · inventory, orders, payments modules · API→ML proxy |
| 🌱 **Planned** | Object storage · email · blockchain reconciliation · React TypeScript migration · integration & end-to-end tests · trained forecasting models |

---

## 🚀 Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/sillyfellow21/WareWise-AI)

One Blueprint ([`render.yaml`](render.yaml)) provisions the whole monorepo — client,
API, forecasting service, Postgres and Key Value — and wires them together:

| Resource | Kind | Root | Health check |
| --- | --- | --- | --- |
| `warewise-client` | Static site (global CDN) | `client/` | – (`/*` rewrites to `/index.html`) |
| `warewise-api` | Node web service, free plan | `server/` | `GET /api/health` |
| `warewise-ml` | Python web service, free plan | `ml-service/` | `GET /health` |
| `warewise-db` | Render Postgres 16, internal-only | – | – |
| `warewise-cache` | Render Key Value (Redis-compatible) | – | – |

| 🔗 | Link |
| --- | --- |
| ⚡ Quick deploy | <https://render.com/deploy?repo=https://github.com/sillyfellow21/WareWise-AI> |
| 🎛️ Render dashboard | <https://dashboard.render.com> → *New + > Blueprint* |
| 📜 Blueprint file | [`render.yaml`](render.yaml) |
| 📘 Blueprint reference | <https://render.com/docs/blueprint-spec> |
| 🧾 Deploy notes (ports, env wiring, free-tier limits) | [docs/DEPLOYMENT_SPEC.md](docs/DEPLOYMENT_SPEC.md) |

<details>
<summary>🌸 Deploy the current branch before merging</summary>

The button above deploys the repository's default branch (`main`). To stand the stack up
from this branch first:

```text
https://render.com/deploy?repo=https://github.com/sillyfellow21/WareWise-AI/tree/agents/render-s-blueprint-feature-is-the-best-approach
```

</details>

### Wiring, automatically

- `DATABASE_URL` ← `fromDatabase` (internal connection string for the database's region)
- `REDIS_URL` ← `fromService` on the Key Value instance (`connectionString`)
- `ML_SERVICE_URL` ← `fromService` on the ML service (`host`); the API adds the scheme
  (`https://` for public hosts, `http://` for undotted private addresses)
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` ← generated on the first sync, then preserved
- Both services bind `0.0.0.0` and read the port Render injects (`PORT` for Node,
  `$PORT` for uvicorn), so health checks and zero-downtime deploys behave
- Pushes to `main` redeploy automatically (`autoDeployTrigger: commit`)

### Free-plan reality check 🤍

- Free web services **spin down after 15 minutes idle** — the next request pays a cold
  start of about a minute.
- Free web services can *send* but not *receive* private-network traffic, so the API
  reaches the ML service over its public HTTPS URL. Upgrade both and switch
  `warewise-ml` to `type: pserv` to use the private address (noted inline in `render.yaml`).
- Free Postgres **expires 30 days after creation** and has no backups or managed pooling.
- Free Key Value is in-memory only and may restart without notice.
- Free instances are perfect for a demo or a review — upgrade before real traffic. 💸

---

## 🍡 Local development

**You need:** Node.js 22+, npm, Python 3.12+, Docker.

```sh
# 1 · datastores (Postgres 16 + Redis 7)          → make infra-up
docker compose up -d postgres redis

# 2 · dependencies                                 → make install
npm install --prefix server
npm install --prefix client

# 3 · the web app                                  → http://localhost:5173
npm run dev --prefix client

# 4 · the typed API                                → http://localhost:6001
npm run build:typed --prefix server
npm run start:typed --prefix server
#   (npm run dev --prefix server starts the legacy prototype instead; it needs MONGO_URL)

# 5 · the forecasting service                      → http://localhost:8000
python -m venv .venv
.venv\Scripts\Activate.ps1              # Windows PowerShell
source .venv/bin/activate               # macOS / Linux
pip install -r ml-service/requirements.txt
python -m uvicorn app.main:app --app-dir ml-service --host 0.0.0.0 --port 8000
```

Copy `.env.example`, `server/.env.example` and `client/.env.example` into local `.env`
files before starting the API. Never commit real passwords, keys or `.env` files. 🔐

## 🔧 Configuration

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
| `VITE_API_BASE_URL` | Client | Build-time API origin (`client/src/config/api.js`), defaults to `http://localhost:6001`. |
| `PYTHON_VERSION` | ML | Fully qualified version required by the Render Python runtime. |

## 🩺 Endpoints

**Typed API** — `server/` · live: <https://warewise-api.onrender.com>

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | `200` liveness — the Render health check target |
| `GET` | `/health` · `/api/v1/health` | Liveness (plain and versioned) |
| `GET` | `/ready` | Dependency readiness; `503` until Postgres and Redis are configured |
| `GET` | `/metrics` | Prometheus-style plain-text metric |

**Forecasting service** — `ml-service/` (live: <https://warewise-ml.onrender.com>):
`GET /health`, `GET /ready`,
`POST /api/v1/forecast`, `POST /api/v1/forecast/batch`,
`GET /api/v1/forecast/{productId}`. Contract: [docs/ML_SPEC.md](docs/ML_SPEC.md).

**Legacy prototype** — `server/index.js` (Mongoose + MongoDB, requires `MONGO_URL`;
not deployed — its former host is retired): `/auth/*`, `/users/*`, `/products/*`
and `GET /api/health`.

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

---

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

## 🤝 Contributing

Focused pull requests, one domain change at a time. Read the related document in
`docs/`, update it when behavior changes, and add tests for authorization, validation,
state transitions and failure paths. Full guidelines: [CONTRIBUTING.md](CONTRIBUTING.md).

## 🔐 Security

Please do not open a public issue for vulnerabilities — follow [SECURITY.md](SECURITY.md)
instead. Never place customer information, production data, passwords, wallet keys or
provider credentials in this repository.

---

<div align="center">

### ・:\*:・ 🌸 thank you for stopping by 🌸 ・:\*:・

**WareWise** — count the boxes, keep the humans in charge.

`make lint` ♡ `make test` ♡ `make build`

![made with](https://img.shields.io/badge/made%20with-love%20%26%20pastels-FFB6C1?style=flat-square)
![status](https://img.shields.io/badge/status-in%20progress-B5E8FF?style=flat-square)

[⬆ back to the top](#-warewise-)

</div>




