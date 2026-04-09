// src/adapters/vertex_metadata.ts
//
// Google-specific metadata adapter.
// Important:
// - Google metadata is an extension layer
// - it must not alter canonical AER semantics
// - avoid strong wording like 'verified=true' for grounding
export function captureVertexMetadata() {
    // Placeholder scaffold:
    // Codex should wire this to real Vertex/Genkit metadata when implementing.
    return {
        vertex_grounding_present: undefined,
        source_count: undefined,
        support_chunks: undefined,
        execution_principal: null,
    };
}
//# sourceMappingURL=vertex_metadata.js.map