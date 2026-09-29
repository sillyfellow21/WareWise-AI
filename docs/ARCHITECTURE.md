# WareWise Architecture

## Target topology
The React client calls the Node/TypeScript API over HTTPS. The API owns authentication, authorization, business workflows, and persistence. PostgreSQL is the system of record. The FastAPI ML service owns forecasting computation. Blockchain access is isolated in the client and the contract in `foundry/`; there is no backend adapter for it. Object storage holds user and product media. Redis is provisioned by the Blueprint but not connected to. The API is not versioned today, apart from a `/api/v1/health` alias.

## Boundaries
- `client`: presentation, route state, API client, and user interactions.
- `server`: business rules, authorization, persistence, jobs, and integrations.
- `ml-service`: validated forecasting inputs and model execution only.
- `foundry`: one Solidity contract, `src/Payment.sol`. There are no deployment
  scripts and no contract tests yet.
- `docs`: versioned contracts and operational decisions.

## Request path
Today: `client -> API middleware -> module route -> controller -> Prisma -> PostgreSQL`.
There is no schema-validation, service or repository layer yet — controllers coerce
the body by hand and call Prisma directly. The service/repository split above is the
target shape.

## Migration strategy
1. Add typed modules beside the current Express application.
2. Introduce PostgreSQL/Prisma and dual-read only where a module is ready.
3. Move authentication first, then inventory and orders.
4. Retire Mongoose routes after contract and integration tests pass.
5. Keep blockchain and ML behind stable interfaces throughout the migration.
