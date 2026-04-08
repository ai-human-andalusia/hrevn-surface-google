# GENKIT_INTEGRATION.md

## Current state
Google / Genkit has a scaffolded HREVN wrapper concept.
This is enough to signal the Google door at launch.

The managed runtime is now live at:
- `https://api.hrevn.com`

## Not yet
- not a production npm package
- not a final runtime connector
- not a full Vertex SDK implementation

## Core rule
Use the same BaselineResult semantics and the same AER semantics as OpenAI/Codex and Anthropic.

## Current practical path
1. construct `HrevnManagedClient` from environment
2. call `baseline-check` before consequential flow execution
3. call `generate-bundle` after successful flow completion when a traceable artifact is needed
4. keep Google-specific metadata as extension only

## Supported alpha sequence
1. test the managed API client first
2. test the flow wrapper second
3. keep the managed runtime as the source of truth

## Current example files
- `src/client.ts`
- `src/middleware.ts`
- `examples/managed_api_client.ts`
- `examples/treasury_transfer_flow.ts`
- `docs/GOOGLE_ALPHA_TESTING.md`
