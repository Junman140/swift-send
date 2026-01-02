# Stellar Contracts Configuration

## Environment Variables

Add these to your `.env` file:

```bash
# Deployed Contract IDs (Testnet)
CONTRACT_SIMPLE_COUNTER=CA7JEZGXWTX62LE6HSW7C6DQHDFNEKEFYI2AYNXU67AJPKIKNRINTCHB
CONTRACT_ACCESS_GUARD=CDPOR7XAJDYSPCQMLM5AJESL4IOC7L2J34GW5UKSTC6NX7Z4GG53OLEF

# Future contract deployments
CONTRACT_REMITTANCE_ESCROW=
CONTRACT_WALLET_REGISTRY=
CONTRACT_COMPLIANCE_LIMITS=

# Contract Creator Account
STELLAR_CONTRACT_CREATOR=GABUKS5YQ62VV5FWSYDGGAH32U3GZLXQK6BVFK4CDZJPEEWZTMJTJ75Z
```

## Contract Deployment Summary

### ✅ Simple Counter
- **Deployed**: 2026-01-02 06:57:25 UTC
- **Contract ID**: `CA7JEZGXWTX62LE6HSW7C6DQHDFNEKEFYI2AYNXU67AJPKIKNRINTCHB`
- **WASM Hash**: `f27c656e8f36e19f7b7a5eae07ca1970e992239748103020e7441b8a3721a7e3`
- **Transaction**: `9d6d151f84799cc4793286851efdfb8bef14a993b281c9e5d00d41fb2be93f87`

### ✅ Access Guard
- **Deployed**: 2026-01-02 07:01:41 UTC
- **Contract ID**: `CDPOR7XAJDYSPCQMLM5AJESL4IOC7L2J34GW5UKSTC6NX7Z4GG53OLEF`
- **WASM Hash**: `856f52a845878338f373779b5b94f85c6f7b263f994102e9679a00ee080722de`
- **Transaction**: `018fe3a65a38056df659edcc55346678c368a230532849023d95652cb09053d1`

### 🚧 Next Deployments (Ready)

**All contracts are deployment-ready with tests removed for slim artifacts:**

#### Remittance Escrow
- **Status**: ✅ Ready for deployment
- **Source**: `contracts/remittance-escrow/src/lib.rs`
- **Purpose**: Transfer state management, escrow operations
- **Deploy**: `soroban contract deploy --wasm target/wasm32-unknown-unknown/release/remittance_escrow.wasm`

#### Wallet Registry  
- **Status**: ✅ Ready for deployment
- **Source**: `contracts/wallet-registry/src/lib.rs`
- **Purpose**: User-to-wallet mapping with guardian support
- **Deploy**: `soroban contract deploy --wasm target/wasm32-unknown-unknown/release/wallet_registry.wasm`

#### Compliance Limits
- **Status**: ✅ Ready for deployment
- **Source**: `contracts/compliance-limits/src/lib.rs`
- **Purpose**: User tier management and spending limits
- **Deploy**: `soroban contract deploy --wasm target/wasm32-unknown-unknown/release/compliance_limits.wasm`

**Quick Deploy Sequence:**
```bash
cd contracts
soroban contract build
# Deploy each contract individually
soroban contract deploy --wasm target/wasm32-unknown-unknown/release/remittance_escrow.wasm --source-account GABUKS5YQ62VV5FWSYDGGAH32U3GZLXQK6BVFK4CDZJPEEWZTMJTJ75Z --network testnet
```

## API Endpoints

Check contract status: `GET /health/contracts`

```json
{
  "status": "operational",
  "contracts": {
    "simpleCounter": {
      "contractId": "CA7JEZGXWTX62LE6HSW7C6DQHDFNEKEFYI2AYNXU67AJPKIKNRINTCHB",
      "wasmHash": "f27c656e8f36e19f7b7a5eae07ca1970e992239748103020e7441b8a3721a7e3",
      "deployed": "2026-01-02 06:57:25 UTC",
      "status": "active"
    }
  }
}
```