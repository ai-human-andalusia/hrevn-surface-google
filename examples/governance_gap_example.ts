import "dotenv/config";
import { HrevnManagedClient } from "../src";

async function main(): Promise<void> {
  const client = HrevnManagedClient.fromEnv();

  const result = await client.baselineCheck<Record<string, unknown>>({
    task_type: "ai_governance",
    profile: "eu_readiness_profile",
    record: {
      summary: "Intentional governance gap example for remedy payload visibility",
    },
    metadata: {
      surface: "google",
      source: "governance_gap_example",
    },
  });

  const view = {
    result: result.result,
    profile_detected: result.profile_detected,
    readiness_level: result.readiness_level,
    missing_required_blocks: result.missing_required_blocks,
    risk_flags: result.risk_flags,
    recommended_next_step: result.recommended_next_step,
    remedy_payload: result.remedy_payload,
    check_id: result.check_id,
    checked_at: result.checked_at,
  };

  console.log(JSON.stringify(view, null, 2));
}

void main();
