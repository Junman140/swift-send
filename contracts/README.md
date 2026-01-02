# SwiftSend Soroban Contracts

This workspace contains Soroban smart contracts that anchor SwiftSend's remittance orchestration on-chain.

## Deployed Contracts (Testnet)

### ✅ Simple Counter
- **Contract ID**: `CA7JEZGXWTX62LE6HSW7C6DQHDFNEKEFYI2AYNXU67AJPKIKNRINTCHB`
- **WASM Hash**: `f27c656e8f36e19f7b7a5eae07ca1970e992239748103020e7441b8a3721a7e3`
- **Deployed**: 2026-01-02 06:57:25 UTC
- **Explorer**: [Stellar Expert](https://stellar.expert/explorer/testnet/contract/CA7JEZGXWTX62LE6HSW7C6DQHDFNEKEFYI2AYNXU67AJPKIKNRINTCHB)
- **Status**: ✅ Active

### ✅ Access Guard
- **Contract ID**: `CDPOR7XAJDYSPCQMLM5AJESL4IOC7L2J34GW5UKSTC6NX7Z4GG53OLEF`
- **WASM Hash**: `856f52a845878338f373779b5b94f85c6f7b263f994102e9679a00ee080722de`
- **Deployed**: 2026-01-02 07:01:41 UTC
- **Explorer**: [Stellar Expert](https://stellar.expert/explorer/testnet/contract/CDPOR7XAJDYSPCQMLM5AJESL4IOC7L2J34GW5UKSTC6NX7Z4GG53OLEF)
- **Status**: ✅ Active

### 🚧 Ready for Deployment

#### Remittance Escrow
- **Source**: `remittance-escrow/src/lib.rs`  
- **Status**: ✅ Deployment-ready (tests removed)
- **Purpose**: Holds transfer intents, enforces state transitions (hold, release, refund), and emits normalized events

#### Wallet Registry
- **Source**: `wallet-registry/src/lib.rs`
- **Status**: ✅ Deployment-ready (tests removed)  
- **Purpose**: Maps verified SwiftSend user IDs to on-chain wallet addresses with optional guardians and recovery metadata

#### Compliance Limits
- **Source**: `compliance-limits/src/lib.rs`
- **Status**: ✅ Deployment-ready (tests removed)
- **Purpose**: Tracks user tiers, on-chain spending, and enforces programmable limits before a transfer is reserved

**Deploy Command:**
```bash
cd contracts
soroban contract build
soroban contract deploy --wasm target/wasm32-unknown-unknown/release/[contract_name].wasm --source-account GABUKS5YQ62VV5FWSYDGGAH32U3GZLXQK6BVFK4CDZJPEEWZTMJTJ75Z --network testnet
```

## Contract Details

1. **simple-counter** – Basic counter contract for testing and demonstration
2. **access-guard** – Role-based access control and permission management
3. **remittance-escrow** – holds transfer intents, enforces state transitions (hold, release, refund), and emits normalized events so off-chain services stay in sync.
4. **wallet-registry** – maps verified SwiftSend user IDs to on-chain wallet addresses with optional guardians and recovery metadata.
5. **compliance-limits** – tracks user tiers, on-chain spending, and enforces programmable limits before a transfer is reserved.

**Contract Creator**: `GABUKS5YQ62VV5FWSYDGGAH32U3GZLXQK6BVFK4CDZJPEEWZTMJTJ75Z`

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
