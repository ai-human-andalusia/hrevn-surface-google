export type BaselineCheckRequest = {
    task_type?: string;
    profile?: string;
    record?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
};
export type GenerateBundleRequest = {
    record: Record<string, unknown>;
    traces: Array<Record<string, unknown>>;
    options?: Record<string, unknown>;
};
export type VerifyBundleRequest = {
    source: string;
};
export declare const DEFAULT_HREVN_API_BASE_URL = "https://api.hrevn.com";
type HrevnClientOptions = {
    baseUrl: string;
    apiKey: string;
};
export declare class HrevnManagedClient {
    private readonly baseUrl;
    private readonly apiKey;
    constructor(options: HrevnClientOptions);
    static fromEnv(env?: Record<string, string | undefined>): HrevnManagedClient;
    private post;
    baselineCheck<T>(request: BaselineCheckRequest): Promise<T>;
    generateBundle<T>(request: GenerateBundleRequest): Promise<T>;
    verifyBundle<T>(request: VerifyBundleRequest): Promise<T>;
}
export {};
