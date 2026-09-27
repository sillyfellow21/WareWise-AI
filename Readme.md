# WareWise

## A simpler way to manage warehouse supply

WareWise is a warehouse and supplier management platform. It helps teams see
what they have, find what they need, and make better purchasing decisions.

The project brings suppliers, employees, warehouse managers, sales information,
and payment records into one place.

## What WareWise does

### For suppliers

Suppliers can list products, share prices and availability, and make their
products visible to businesses that need them.

### For employees

Employees can browse available products, request items, and keep track of the
products they use in their warehouse.

### For warehouse managers

Managers can review stock levels, monitor incoming and outgoing items, and
approve replenishment requests before new products are ordered.

### For the whole team

WareWise is designed to provide:

- A shared product marketplace
- Inventory and stock tracking
- Purchase and approval workflows
- Sales and demand forecasts
- A history of inventory changes
- Payment records, with optional blockchain settlement

## How it works

1. A supplier adds a product to the marketplace.
2. An employee or warehouse team member finds the product they need.
3. A purchase request is created and reviewed by the appropriate manager.
4. When stock arrives, the team records the delivery.
5. WareWise keeps a history of every stock change, such as a delivery, sale,
	return, transfer, or adjustment.
6. The forecasting service studies historical sales and estimates future demand.
7. A manager reviews the recommendation and decides whether more stock should
	be ordered.

Forecasts are recommendations, not automatic orders. A person remains in control
of every replenishment decision.

## Project status

WareWise began as a hackathon prototype and is now being rebuilt in stages for
reliable real-world use.

The current repository contains:

- The existing web application in `client/`
- The existing API and migration target in `server/`
- The payment contract workspace in `foundry/`
- The forecasting service in `ml-service/`
- Product, security, data, API, and deployment plans in `docs/`

The production features are not all finished yet. The current implementation
status is recorded in [docs/IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md).

## Getting started

### For users and reviewers

The application is still under active development. A complete hosted production
version is not available yet, and the old prototype credentials have been
removed for security.

### For developers

You need Node.js, npm, Python, and Docker installed.

Start the local database services:

```sh
docker compose up -d postgres redis
```

Install the application dependencies:

```sh
npm install --prefix server
npm install --prefix client
```

Start the current web application:

```sh
npm run dev --prefix client
```

Run the typed API checks:

```sh
npm test --prefix server
```

The local API needs environment values from `.env.example` and
`server/.env.example`. Never commit real passwords, API keys, private keys, or
`.env` files.

## Project documentation

The `docs/` folder explains the system in plain, testable terms. The
[implementation status](https://github.com/sillyfellow21/WareWise-AI/blob/main/docs/IMPLEMENTATION_STATUS.md)
is the best place to start: it clearly separates completed work from planned
work and lists the decisions still needed from the project owner.

- [Product overview](https://github.com/sillyfellow21/WareWise-AI/blob/main/docs/PRODUCT_SPEC.md)
- [System architecture](https://github.com/sillyfellow21/WareWise-AI/blob/main/docs/ARCHITECTURE.md)
- [Database design](https://github.com/sillyfellow21/WareWise-AI/blob/main/docs/DATABASE_SCHEMA.md)
- [API design](https://github.com/sillyfellow21/WareWise-AI/blob/main/docs/API_SPEC.md)
- [Security requirements](https://github.com/sillyfellow21/WareWise-AI/blob/main/docs/SECURITY_SPEC.md)
- [Forecasting requirements](https://github.com/sillyfellow21/WareWise-AI/blob/main/docs/ML_SPEC.md)
- [Blockchain requirements](https://github.com/sillyfellow21/WareWise-AI/blob/main/docs/BLOCKCHAIN_SPEC.md)
- [Deployment requirements](https://github.com/sillyfellow21/WareWise-AI/blob/main/docs/DEPLOYMENT_SPEC.md)
- [Implementation status](https://github.com/sillyfellow21/WareWise-AI/blob/main/docs/IMPLEMENTATION_STATUS.md)

## Privacy and security

Do not place customer information, production data, passwords, wallet keys, or
provider credentials in this repository. See [SECURITY.md](SECURITY.md) for
vulnerability reporting and [docs/SECURITY_SPEC.md](docs/SECURITY_SPEC.md) for
the security requirements being implemented.

## Contributing

Small, focused improvements are easiest to review. Before changing a workflow,
read the related document in `docs/`, update it when the intended behavior
changes, and add tests for important rules and permissions. See
[CONTRIBUTING.md](CONTRIBUTING.md) for the project guidelines.

