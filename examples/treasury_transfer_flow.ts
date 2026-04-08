// examples/treasury_transfer_flow.ts
//
// Example conceptual Genkit flow using HREVN middleware

import "dotenv/config";
import { HrevnManagedClient, hrevnFlowGuard } from "../src";

const client = HrevnManagedClient.fromEnv();

const middleware = [
  hrevnFlowGuard({
    client,
    profile: "agentic_finance_profile",
    policy: "strict",
    jurisdiction: "EU",
    showRegulatoryNotices: true,
    buildBaselineRequest(input) {
      return {
        task_type: "agentic_finance_flow",
        profile: "agentic_finance_profile",
        record: {
          delegated_authority: {},
          approval_controls: {},
          transaction_context: {},
        },
        metadata: {
          surface: "google",
          example: "treasury_transfer_flow",
          input,
        },
      };
    },
    buildBundleRequest(input, output) {
      return {
        record: {
          agent_name: "google_genkit_alpha",
          model_version: "genkit-wrapper-dev-alpha",
          task_description: "Treasury transfer flow protected by HREVN middleware",
          test_environment: "developer-alpha",
          issuer_id: "hrevn-google-surface",
          issuer_name: "HREVN Google Surface",
          issuer_type: "organizational_issuer",
          flow_name: "treasuryTransferFlow",
          input: input as Record<string, unknown>,
          output: output as Record<string, unknown>,
        },
        traces: [
          {
            test_id: "GOOGLE-FLOW-001",
            result: "PASS",
            confidence: "high",
            duration_ms: 120,
            tokens_used: 0,
            input_text: JSON.stringify(input),
            validator_notes: ["Developer Alpha flow completed"],
          },
        ],
      };
    },
  }),
];

// Still a conceptual scaffold.
// The HREVN middleware now points to the live managed runtime at api.hrevn.com
// via HrevnManagedClient.fromEnv().
export const treasuryTransferFlow = {
  name: "treasuryTransferFlow",
  middleware,
};

async function runDeveloperAlphaFlow(): Promise<void> {
  const input = { amount: 1500, destination: "0xabc..." };
  const guard = middleware[0];

  const output = await guard(input, async () => {
    return {
      status: "success",
      transferId: "TX-123",
      ...input,
    };
  });

  console.log(JSON.stringify(output, null, 2));
}

void runDeveloperAlphaFlow();
