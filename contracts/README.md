# SwiftSend Soroban Contracts

This workspace contains Soroban smart contracts that anchor SwiftSend's remittance orchestration on-chain.

## Contracts

1. **remittance-escrow** – holds transfer intents, enforces state transitions (hold, release, refund), and emits normalized events so off-chain services stay in sync.
2. **wallet-registry** – maps verified SwiftSend user IDs to on-chain wallet addresses with optional guardians and recovery metadata.
3. **compliance-limits** – tracks user tiers, on-chain spending, and enforces programmable limits before a transfer is reserved.

Each contract is a standalone crate compiled to WASM. Use the Soroban CLI to build, deploy, and invoke them.

## Building

```bash
cd contracts
soroban contract build
```

The CLI will compile each crate into `target/wasm32-unknown-unknown/release/*.wasm` for deployment.

## Testing Locally

```bash
soroban contract invoke \
  --wasm target/wasm32-unknown-unknown/release/remittance_escrow.wasm \
  --id <TEMP_ID> \
  --fn get_transfer \
  --arg id=<TRANSFER_ID>
```

Adjust arguments per contract interface. For full flows, run `soroban network start` to spin up a local sandbox and sequence invocations across contracts.
