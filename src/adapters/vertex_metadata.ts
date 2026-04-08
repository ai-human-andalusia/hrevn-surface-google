// src/adapters/vertex_metadata.ts
//
// Google-specific metadata adapter.
// Important:
// - Google metadata is an extension layer
// - it must not alter canonical AER semantics
// - avoid strong wording like 'verified=true' for grounding

export type VertexGroundingInfo = {
  vertex_grounding_present?: boolean;
  source_count?: number;
  support_chunks?: number;
  execution_principal?: string | null;
};

export function captureVertexMetadata(): VertexGroundingInfo {
  // Placeholder scaffold:
  // Codex should wire this to real Vertex/Genkit metadata when implementing.
  return {
    vertex_grounding_present: undefined,
    source_count: undefined,
    support_chunks: undefined,
    execution_principal: null,
  };
}
