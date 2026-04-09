// src/index.ts
// HREVN Genkit Plugin v0.1.0
//
// Architecture-first placeholder entrypoint.
// This file intentionally stays simple:
// - register HREVN middleware/helpers
// - keep Google wrapper thin
// - reuse canonical HREVN semantics
export { hrevnFlowGuard } from "./middleware";
export { captureVertexMetadata } from "./adapters/vertex_metadata";
export { DEFAULT_HREVN_API_BASE_URL, HrevnManagedClient } from "./client";
//# sourceMappingURL=index.js.map