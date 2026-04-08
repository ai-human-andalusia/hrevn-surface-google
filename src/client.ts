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

export const DEFAULT_HREVN_API_BASE_URL = "https://api.hrevn.com";

type HrevnClientOptions = {
  baseUrl: string;
  apiKey: string;
};

export class HrevnManagedClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(options: HrevnClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, "");
    this.apiKey = options.apiKey;
  }

  static fromEnv(
    env: Record<string, string | undefined> = process.env,
  ): HrevnManagedClient {
    const apiKey = env.HREVN_API_KEY;

    if (!apiKey) {
      throw new Error("HREVN_API_KEY is required");
    }

    return new HrevnManagedClient({
      baseUrl: env.HREVN_API_BASE_URL || DEFAULT_HREVN_API_BASE_URL,
      apiKey,
    });
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
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

    return (await response.json()) as T;
  }

  async baselineCheck<T>(request: BaselineCheckRequest): Promise<T> {
    return this.post<T>("/v1/baseline-check", request);
  }

  async generateBundle<T>(request: GenerateBundleRequest): Promise<T> {
    return this.post<T>("/v1/generate-bundle", request);
  }

  async verifyBundle<T>(request: VerifyBundleRequest): Promise<T> {
    return this.post<T>("/v1/verify-bundle", request);
  }
}
