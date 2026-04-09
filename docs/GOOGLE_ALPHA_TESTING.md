# Google Alpha Testing

## Public repo

- `https://github.com/ai-human-andalusia/hrevn-surface-google`

## Live backend

- `https://api.hrevn.com`

## Supported first path

Google / Genkit wrapper -> managed API client -> `https://api.hrevn.com`

In this alpha, the supported test sequence is:
1. client first
2. flow second
3. governance gap example third

## Setup

```bash
git clone https://github.com/ai-human-andalusia/hrevn-surface-google
cd hrevn-surface-google
npm install
npx hrevn-cli setup --key <issued-alpha-key>
```

The bootstrapper:
- validates the live HREVN connection
- updates `.env` without deleting other variables
- prints a real baseline result
- writes `hrevn_test_flow.ts` if it does not already exist

If you prefer the manual path, you can still:

```bash
cp .env.example .env
```

and then set your issued alpha key in `.env`.

## First test: client

```bash
npx tsx examples/managed_api_client.ts
```

Expected result:
- a real `BaselineResult`
- returned from `https://api.hrevn.com`
- not a mock and not a textual explanation

## Second test: flow

```bash
npx tsx examples/treasury_transfer_flow.ts
```

Expected result:
- a successful simulated treasury flow
- wrapped by the HREVN middleware path
- still using the managed runtime as the source of truth

## Optional third test: governance gap

```bash
npx tsx examples/governance_gap_example.ts
```

Expected result:
- a real `BaselineResult`
- visible `missing_required_blocks`
- visible `risk_flags`
- visible `recommended_next_step`
- visible `remedy_payload`

This example is intentionally incomplete. Its purpose is to show how the live
runtime guides the developer toward the missing governance evidence instead of
only returning a pass/fail signal.

## Important notes

- this is a technical alpha
- the runtime truth stays in the managed API
- the client is the supported first path
- the flow example is the supported second path
- this is not yet a final production npm package
