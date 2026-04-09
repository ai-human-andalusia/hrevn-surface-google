export const DEFAULT_HREVN_API_BASE_URL = "https://api.hrevn.com";
export class HrevnManagedClient {
    baseUrl;
    apiKey;
    constructor(options) {
        this.baseUrl = options.baseUrl.replace(/\/$/, "");
        this.apiKey = options.apiKey;
    }
    static fromEnv(env = process.env) {
        const apiKey = env.HREVN_API_KEY;
        if (!apiKey) {
            throw new Error("HREVN_API_KEY is required");
        }
        return new HrevnManagedClient({
            baseUrl: env.HREVN_API_BASE_URL || DEFAULT_HREVN_API_BASE_URL,
            apiKey,
        });
    }
    async post(path, body) {
        const response = await fetch(`${this.baseUrl}${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const detail = await response.text();
            throw new Error(`HREVN managed API error ${response.status}: ${detail}`);
        }
        return (await response.json());
    }
    async baselineCheck(request) {
        return this.post("/v1/baseline-check", request);
    }
    async generateBundle(request) {
        return this.post("/v1/generate-bundle", request);
    }
    async verifyBundle(request) {
        return this.post("/v1/verify-bundle", request);
    }
}
//# sourceMappingURL=client.js.map