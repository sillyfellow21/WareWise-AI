# Licensing and Free Stack

## What is free and open source

The main application libraries are free to use and source-available under their own permissive or copyleft licenses, including React, Vite, Material UI, Redux Toolkit, Wagmi, Viem, FastAPI, Pydantic, Uvicorn, Express, TypeScript, Foundry, PostgreSQL, and Redis.

The exact license of every direct and transitive dependency must still be reviewed before commercial distribution. This document is not a substitute for each package's license notice.

## Changes made for a self-hosted setup

- RainbowKit and its hosted WalletConnect project requirement were removed.
- Wallet connections now use Wagmi's open-source injected connector.
- The frontend no longer calls the hosted prediction endpoint.
- Forecast requests use `VITE_ML_SERVICE_URL` and the local ML service.
- A local deterministic monthly baseline keeps the legacy chart functional until trained model storage is implemented.
- Local PostgreSQL and Redis are available through Docker Compose.

## What is not open source or not guaranteed free

- GitHub hosting and GitHub Actions are hosted services with usage limits and separate terms.
- Cloud hosting, managed PostgreSQL, managed Redis, email, object storage, and monitoring may charge money.
- Public blockchain RPC endpoints may impose quotas and are not guaranteed for production.
- Blockchain transactions require network gas fees, even when the software is open source.
- MongoDB server licensing is not OSI-approved open source. The final target is PostgreSQL; the legacy MongoDB API must be retired before claiming an entirely open-source production stack.
- Docker Desktop has separate commercial licensing terms. Podman or Docker Engine can be used where Docker Desktop licensing is unsuitable.

## Zero-cost local development

Use local software and test networks:

```text
Node.js + npm
Python + FastAPI/Uvicorn
PostgreSQL
Redis
Foundry Anvil
A browser wallet with a local Anvil account
```

Run local services with Docker Compose or a compatible free container runtime. Use Anvil for blockchain development so no real gas is required. Never use local private keys or test funds in production.

## Required configuration

Copy `client/.env.example` and `server/.env.example` for local values. No hosted WalletConnect, Alchemy, prediction API, or paid provider key is required for the current local frontend/ML path.
