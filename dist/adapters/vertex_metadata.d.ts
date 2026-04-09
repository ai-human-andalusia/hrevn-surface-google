export type VertexGroundingInfo = {
    vertex_grounding_present?: boolean;
    source_count?: number;
    support_chunks?: number;
    execution_principal?: string | null;
};
export declare function captureVertexMetadata(): VertexGroundingInfo;
