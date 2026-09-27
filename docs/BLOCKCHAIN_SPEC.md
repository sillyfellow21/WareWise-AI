# WareWise Blockchain Specification

Blockchain is an optional settlement adapter, not the inventory or order system of record.

## Contract responsibilities
- Accept an approved payment intent with an idempotency reference.
- Emit payment-created, payment-confirmed, and payment-failed events.
- Reject duplicate intent references.
- Expose no private key management to the client.

## Backend integration
`blockchain.service.ts` creates and verifies payment intents, records transaction hashes, and reconciles confirmations asynchronously. Controllers do not import wallet or contract clients.

## Operational rules
Network, contract address, chain ID, RPC URL, and signer credentials are environment configuration. Transactions are retried only through an idempotent queue. A payment cannot transition an order to fulfilled until the database records the verified confirmation.
