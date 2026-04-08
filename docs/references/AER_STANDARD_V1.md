# AER_STANDARD_V1.md

## HREVN canonical rule
Google / Genkit may add platform-specific metadata, but must preserve the same
canonical HREVN AER semantics used in OpenAI/Codex and Anthropic.

### Canonical AER core
- `agent_identity`
- `integrity_context`
- `action_context`
- `action_outcome`
- `evidence_hash_sha256`
- `metadata`

### Google-specific extensions allowed
- `vertex_grounding_info`
- `execution_principal`
- Cloud Logging / telemetry metadata

### Rule
These are extensions only.
They must not replace or redefine the HREVN core receipt semantics.
