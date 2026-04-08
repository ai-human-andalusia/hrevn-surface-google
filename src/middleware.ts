// src/middleware.ts
//
// HREVN Genkit middleware concept:
// - do not reinvent baseline logic here
// - do not redefine AER semantics here
// - wrap the flow lifecycle and delegate to the HREVN core

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
  buildBundleRequest?: (
    input: unknown,
    output: unknown,
  ) => {
    record: HrevnRecord;
    traces: Array<Record<string, unknown>>;
    options?: Record<string, unknown>;
  } | null;
};

export function hrevnFlowGuard(options: HrevnFlowGuardOptions = {}) {
  const metadata = {
    surface: "google",
    policy: options.policy ?? "observe",
    jurisdiction: options.jurisdiction,
    show_regulatory_notices: options.showRegulatoryNotices ?? false,
    ...options.metadata,
  };

  return async function middleware(input: unknown, next: () => Promise<unknown>) {
    const client = options.client;

    if (client) {
      const baselineRequest = options.buildBaselineRequest
        ? options.buildBaselineRequest(input)
        : {
            task_type: "ai_workflow",
            profile: options.profile,
            record: {},
            metadata,
          };

      await client.baselineCheck(baselineRequest);
    }

    const output = await next();

    if (client && options.buildBundleRequest) {
      const bundleRequest = options.buildBundleRequest(input, output);

      if (bundleRequest) {
        await client.generateBundle(bundleRequest);
      }
    }

    return output;
  };
}
