# GOOGLE_BUNDLE_DECISIONS_V0_1.md

## Goal
Create a first Google/Genkit packaging scaffold without fragmenting the HREVN core.

## Decisions
- package as integration/library scaffold, not classic chat plugin
- keep middleware thin
- preserve canonical AER semantics
- allow Google-specific metadata only as extension
- keep regulatory notice separate from mandatory AER core

## Priority order
1. Cloud Logging structured telemetry
2. canonical AER consistency
3. prudent Vertex grounding metadata
4. execution principal capture when available

## Non-goals for v0.1
- finished production connector
- full Vertex SDK implementation
- full npm release pipeline
