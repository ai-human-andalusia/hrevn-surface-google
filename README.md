# HREVN Genkit Integration (Developer Alpha)

This repo is a Google / Genkit-facing wrapper surface for the live HREVN
managed runtime.

## Why HREVN

AI agents and multi-step workflows fail in ambiguous ways. When a sequence is
interrupted, neither the user nor the system can always determine with
certainty what completed, what failed mid-execution, and where work can safely
resume. Without a verifiable record, context is reconstructed from memory or
chat history, wasting tokens, repeating work, and leaving no reliable trail.

HREVN adds a structured evidence layer: baseline checks before consequential
steps, tamper-evident receipts after execution, and manifests that allow
workflows to continue from the last verified point rather than restarting from
scratch.

For teams operating in regulated or high-stakes environments, HREVN also
supports evidentiary discipline: structured records of what ran, under what
authority, and when it stopped. This is particularly relevant for AI systems
that may fall within EU regulatory timelines in 2026 and beyond. HREVN does
not make a system legally compliant, but it provides structured, verifiable
evidence that compliance, audit, and governance processes can use.

In Google / Genkit workflows, HREVN acts as a thin evidence layer over flows:
baseline before consequential steps, tamper-evident receipt after execution,
and structured records for audit and regulatory readiness without moving the
core runtime into the wrapper.

## What it is
- a thin Google-facing wrapper
- a reusable managed API client
- a middleware path for baseline-before-flow and bundle-after-flow patterns
- a public bridge to `https://api.hrevn.com`

Current supported alpha path:
- client-first
- flow-second
- managed runtime behind `https://api.hrevn.com`

## What it is not yet
- not the private HREVN runtime
- not a final production npm package
- not a full Vertex SDK implementation
- not a replacement for `hrevn-core`

## Quick Start

Install the published developer-alpha package:

```bash
npm install @hrevn/genkit-plugin
```

Or, if you want to work from this repo directly:

```bash
npm install
npx hrevn-cli setup --key <issued-alpha-key>
```

For the supported technical alpha path, see:
- `docs/GOOGLE_ALPHA_TESTING.md`
- `docs/ALPHA_EXECUTION_TRACE.md`

The bootstrapper validates the live runtime connection, updates `.env` without
deleting other variables, prints a real baseline result, and writes a
`hrevn_test_flow.ts` example if it does not already exist.

## Recommended test sequence

Run the tests in this order:
1. `npx hrevn-cli setup --key <issued-alpha-key>`
2. `npx tsx examples/managed_api_client.ts`
3. `npx tsx examples/treasury_transfer_flow.ts`
4. `npx tsx examples/governance_gap_example.ts`

## First test: client

```bash
npx tsx examples/managed_api_client.ts
```

## Second test: flow path

```bash
npx tsx examples/treasury_transfer_flow.ts
```

## Optional third test: governance gap

```bash
npx tsx examples/governance_gap_example.ts
```

This intentionally sends an incomplete governance-oriented record so the live
runtime returns:
- `missing_required_blocks`
- `risk_flags`
- `recommended_next_step`
- `remedy_payload`

The first test validates direct connectivity to the live managed API.
The second test validates the middleware path around a simulated treasury flow.
The optional third test shows why the remedy path matters when governance
evidence is still incomplete.

## What is already proven in this repo
- the TypeScript client can call the live managed API
- the middleware path can wrap a simulated treasury flow
- the runtime stays behind `https://api.hrevn.com`

## Included
- `src/client.ts`
- `src/middleware.ts`
- `src/adapters/vertex_metadata.ts`
- `examples/managed_api_client.ts`
- `examples/treasury_transfer_flow.ts`
- `examples/governance_gap_example.ts`
- `docs/integration/GENKIT_INTEGRATION.md`
- `docs/bundle/GOOGLE_BUNDLE_DECISIONS.md`
- `docs/references/AER_STANDARD_V1.md`

## Core rule
Google-specific metadata is extension only.
It must not change canonical HREVN semantics.

## Managed Runtime Bridge
The live managed endpoint is:
- `https://api.hrevn.com`

Canonical semantics stay in the managed runtime and in the private HREVN core.

## Current status
This is a technical alpha with a real developer test path and a public npm
package:
- `@hrevn/genkit-plugin`
- thin wrapper
- real runtime behind `https://api.hrevn.com`
- not a final Google-native SDK
