# WareWise Architecture

## Target topology
The React client calls the versioned Node/TypeScript API over HTTPS. The API owns authentication, authorization, business workflows, and persistence. PostgreSQL is the system of record; Redis provides cache, rate-limit state, and job queues. The FastAPI ML service owns forecasting computation. Blockchain access is isolated behind a backend adapter. Object storage holds user and product media.

## Boundaries
- `client`: presentation, route state, API client, and user interactions.
- `server`: business rules, authorization, persistence, jobs, and integrations.
- `ml-service`: validated forecasting inputs and model execution only.
- `foundry`: contracts, deployment scripts, and contract tests.
- `docs`: versioned contracts and operational decisions.

## Request path
`client -> API middleware -> module route -> schema validation -> service -> repository -> PostgreSQL`.
External calls are performed by services, never directly by controllers. Controllers translate HTTP to application commands and responses.

## Migration strategy
1. Add typed modules beside the current Express application.
2. Introduce PostgreSQL/Prisma and dual-read only where a module is ready.
3. Move authentication first, then inventory and orders.
4. Retire Mongoose routes after contract and integration tests pass.
5. Keep blockchain and ML behind stable interfaces throughout the migration.
