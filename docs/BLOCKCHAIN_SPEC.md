# WareWise Blockchain Specification

Blockchain is an optional settlement adapter, not the inventory or order system of record.

## What exists today
- `foundry/src/Payment.sol`: a Solidity `0.8.26` contract with `registerUser`,
  `deposit`, `withdraw`, `transfer`, `getReceipts`, `getUser` and a Chainlink
  `convertUSDToETH` helper.
- `client/src/scenes/paymentPage`: a wallet screen using wagmi and RainbowKit on
  **Sepolia**, calling that contract with a hard-coded ABI and address from
  `client/src/constants.js`.
- The page is standalone: nothing in `server/` knows a blockchain exists, and no
  product, order or booking reaches it.

There is **no `blockchain.service.ts`**, no deployment script, and no contract test.
The contract also cannot be built from a clean clone until the Solidity libraries
are fetched with `forge install`.

## Contract responsibilities (target)
- Accept an approved payment intent with an idempotency reference.
- Emit payment-created, payment-confirmed, and payment-failed events.
- Reject duplicate intent references.
- Expose no private key management to the client.

## Backend integration (not implemented)
A future `blockchain.service.ts` would create and verify payment intents, record
transaction hashes, and reconcile confirmations asynchronously. Controllers would not
import wallet or contract clients.

## Operational rules (target)
Network, contract address, chain ID, RPC URL, and signer credentials are environment configuration. Transactions are retried only through an idempotent queue. A payment cannot transition an order to fulfilled until the database records the verified confirmation.
