import { HrevnManagedClient } from "./client";
type HrevnRecord = Record<string, unknown>;
type HrevnFlowGuardOptions = {
    profile?: string;
    policy?: "observe" | "warn" | "strict";
    jurisdiction?: string;
    showRegulatoryNotices?: boolean;
    client?: HrevnManagedClient;
    metadata?: Record<string, unknown>;
    buildBaselineRequest?: (input: unknown) => {
        task_type?: string;
        profile?: string;
        record?: HrevnRecord;
        metadata?: Record<string, unknown>;
    };
    buildBundleRequest?: (input: unknown, output: unknown) => {
        record: HrevnRecord;
        traces: Array<Record<string, unknown>>;
        options?: Record<string, unknown>;
    } | null;
};
export declare function hrevnFlowGuard(options?: HrevnFlowGuardOptions): (input: unknown, next: () => Promise<unknown>) => Promise<unknown>;
export {};
