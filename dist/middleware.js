// src/middleware.ts
//
// HREVN Genkit middleware concept:
// - do not reinvent baseline logic here
// - do not redefine AER semantics here
// - wrap the flow lifecycle and delegate to the HREVN core
export function hrevnFlowGuard(options = {}) {
    const metadata = {
        surface: "google",
        policy: options.policy ?? "observe",
        jurisdiction: options.jurisdiction,
        show_regulatory_notices: options.showRegulatoryNotices ?? false,
        ...options.metadata,
    };
    return async function middleware(input, next) {
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
//# sourceMappingURL=middleware.js.map