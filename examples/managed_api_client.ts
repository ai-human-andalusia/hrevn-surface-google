import "dotenv/config";
import { HrevnManagedClient } from "../src";

async function main(): Promise<void> {
  const client = HrevnManagedClient.fromEnv();

  const result = await client.baselineCheck({
    task_type: "ai_workflow",
    profile: "eu_readiness_profile",
    record: {
      human_oversight: {},
      risk_register: {},
      evidence_lifecycle: {},
    },
    metadata: {
      surface: "google",
      source: "managed_api_client_example",
    },
  });

  console.log(JSON.stringify(result, null, 2));
}

void main();
