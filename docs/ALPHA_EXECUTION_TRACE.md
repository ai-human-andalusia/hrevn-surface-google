# Google Alpha Execution Trace

This document records a real technical alpha execution against the live HREVN
managed runtime.

## Public repo

- `https://github.com/ai-human-andalusia/hrevn-surface-google`

## Live backend

- `https://api.hrevn.com`

## Test sequence used

1. managed API client
2. flow wrapper

## 1. Client test

Command:

```bash
HREVN_API_BASE_URL=https://api.hrevn.com \
HREVN_API_KEY=<issued-alpha-key> \
npx tsx examples/managed_api_client.ts
```

Real output:

```json
{
  "output_version": "1.0",
  "result": "BASELINE_CHECK_COMPLETE",
  "profile_detected": "eu_readiness_profile",
  "readiness_level": "medium",
  "missing_required_blocks": [
    "technical_documentation_refs"
  ],
  "risk_flags": [
    "missing_technical_documentation_refs"
  ],
  "recommended_next_step": "collect_missing_fields",
  "remedy_payload": {
    "technical_documentation_refs": {
      "system_description_ref": null,
      "limitations_ref": null,
      "human_oversight_procedure_ref": null,
      "logging_policy_ref": null
    }
  },
  "check_id": "CHK-D628A4F7D5CB",
  "checked_at": "2026-04-08T21:26:02+00:00"
}
```

What this validates:
- the TypeScript client reaches the live managed backend
- the backend returns a real structured `BaselineResult`
- this is not a mock or a local-only scaffold

## 2. Flow test

Command:

```bash
HREVN_API_BASE_URL=https://api.hrevn.com \
HREVN_API_KEY=<issued-alpha-key> \
npx tsx examples/treasury_transfer_flow.ts
```

Real output:

```json
{
  "status": "success",
  "transferId": "TX-123",
  "amount": 1500,
  "destination": "0xabc..."
}
```

What this validates:
- the wrapper and middleware path runs successfully
- the simulated treasury flow completes cleanly
- the live managed runtime remains the source of truth behind the wrapper

## Summary

This confirms the current Google / Genkit technical alpha path works as
intended:

- client first
- flow second
- live runtime behind `https://api.hrevn.com`
