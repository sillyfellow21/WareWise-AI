# WareWise Security Specification

## Controls
- Validate request bodies, params, and query strings with schemas before services run.
- Use Argon2id or bcrypt with a strong cost for passwords; never log credentials or tokens.
- Use short-lived access tokens and rotated, revocable refresh sessions.
- Enforce RBAC and resource ownership on the server.
- Apply Helmet, strict CORS allowlists, body-size limits, rate limits, and request IDs.
- Use parameterized Prisma queries and allowlisted sort/filter fields.
- Store secrets only in environment/secret management systems.
- Use secure, HTTP-only, SameSite refresh cookies for browser sessions.
- Redact authorization headers, cookies, passwords, and payment data from logs.
- Require idempotency for payment and order side effects.

## Threat priorities
Account takeover, broken object-level authorization, inventory tampering, duplicate payments, leaked secrets, malicious uploads, and forecast-driven unauthorized purchasing.

## Incident response
Rotate exposed credentials immediately, revoke sessions, preserve audit/request logs, disable affected integrations, and document the incident. Existing README test credentials are removed from documentation and must be considered compromised.
