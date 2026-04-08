#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DEFAULT_BASE_URL = "https://api.hrevn.com";
const ENV_PATH = path.resolve(process.cwd(), ".env");
const FLOW_TEMPLATE_PATH = path.resolve(process.cwd(), "hrevn_test_flow.ts");

function color(code, text) {
  return `\u001b[${code}m${text}\u001b[0m`;
}

function info(text) {
  console.log(color("36", text));
}

function ok(text) {
  console.log(color("32", text));
}

function warn(text) {
  console.log(color("33", text));
}

function fail(text) {
  console.error(color("31", text));
}

function usage() {
  console.log(`HREVN CLI

Usage:
  hrevn-cli setup --key <alpha-key> [--base-url <url>] [--skip-flow-template]
`);
}

function parseArgs(argv) {
  const args = { command: undefined, key: undefined, baseUrl: DEFAULT_BASE_URL, skipFlowTemplate: false };
  const [, , command, ...rest] = argv;
  args.command = command;

  for (let i = 0; i < rest.length; i += 1) {
    const token = rest[i];

    if (token === "--key") {
      args.key = rest[i + 1];
      i += 1;
      continue;
    }

    if (token === "--base-url") {
      args.baseUrl = rest[i + 1];
      i += 1;
      continue;
    }

    if (token === "--skip-flow-template") {
      args.skipFlowTemplate = true;
      continue;
    }
  }

  return args;
}

function parseEnv(content) {
  const lines = content.split(/\r?\n/);
  const entries = [];

  for (const line of lines) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) {
      entries.push({ type: "raw", value: line });
      continue;
    }

    entries.push({
      type: "pair",
      key: match[1],
      value: match[2],
    });
  }

  return entries;
}

function stringifyEnv(entries) {
  return `${entries
    .map((entry) => (entry.type === "pair" ? `${entry.key}=${entry.value}` : entry.value))
    .join("\n")
    .replace(/\n+$/, "")}\n`;
}

function upsertEnvPair(entries, key, value) {
  const index = entries.findIndex((entry) => entry.type === "pair" && entry.key === key);
  if (index >= 0) {
    entries[index] = { type: "pair", key, value };
    return;
  }

  if (entries.length && entries[entries.length - 1].type === "raw" && entries[entries.length - 1].value === "") {
    entries.splice(entries.length - 1, 0, { type: "pair", key, value });
    return;
  }

  entries.push({ type: "pair", key, value });
}

function loadEnvFile() {
  if (!fs.existsSync(ENV_PATH)) {
    return [];
  }

  return parseEnv(fs.readFileSync(ENV_PATH, "utf8"));
}

function saveEnvFile(entries) {
  fs.writeFileSync(ENV_PATH, stringifyEnv(entries), "utf8");
}

function hasPackage(name) {
  return fs.existsSync(path.resolve(process.cwd(), "node_modules", name));
}

async function baselineCheck(baseUrl, apiKey) {
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/v1/baseline-check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      task_type: "ai_workflow",
      profile: "eu_readiness_profile",
      record: {
        human_oversight: {},
        risk_register: {},
        evidence_lifecycle: {},
      },
      metadata: {
        surface: "google",
        source: "hrevn_cli_bootstrap",
      },
    }),
  });

  const text = await response.text();
  let data = null;

  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const detail = typeof data === "object" ? JSON.stringify(data) : text;
    throw new Error(`HREVN managed API error ${response.status}: ${detail}`);
  }

  return data;
}

function flowTemplate() {
  return `import "dotenv/config";
import { HrevnManagedClient, hrevnFlowGuard } from "./src";

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
          example: "hrevn_test_flow",
          input,
        },
      };
    },
  }),
];

async function runHrevnTestFlow() {
  const input = { amount: 1500, destination: "0xabc..." };
  const guard = middleware[0];

  const output = await guard(input, async () => ({
    status: "success",
    transferId: "TX-123",
    ...input,
  }));

  console.log(JSON.stringify(output, null, 2));
}

void runHrevnTestFlow();
`;
}

function writeFlowTemplate() {
  if (fs.existsSync(FLOW_TEMPLATE_PATH)) {
    warn(`[SKIP] ${path.basename(FLOW_TEMPLATE_PATH)} already exists`);
    return;
  }

  fs.writeFileSync(FLOW_TEMPLATE_PATH, flowTemplate(), "utf8");
  ok(`[OK] Wrote ${path.basename(FLOW_TEMPLATE_PATH)}`);
}

async function runSetup(args) {
  if (!args.key) {
    usage();
    throw new Error("--key is required");
  }

  info(`[INFO] Validating connection to ${args.baseUrl}...`);
  const baselineResult = await baselineCheck(args.baseUrl, args.key);
  ok(`[OK] HREVN connection established with ${new URL(args.baseUrl).host}`);

  const envEntries = loadEnvFile();
  upsertEnvPair(envEntries, "HREVN_API_BASE_URL", args.baseUrl);
  upsertEnvPair(envEntries, "HREVN_API_KEY", args.key);
  saveEnvFile(envEntries);
  ok(`[OK] Updated ${path.basename(ENV_PATH)}`);

  if (hasPackage("@genkit-ai/core")) {
    ok("[OK] @genkit-ai/core detected");
  } else {
    warn("[WARN] @genkit-ai/core not detected. The wrapper works, but Genkit-native integration still needs the core package.");
  }

  console.log("");
  info("[EVIDENCE] First baseline result");
  console.log(JSON.stringify(baselineResult, null, 2));

  if (!args.skipFlowTemplate) {
    writeFlowTemplate();
  }

  console.log("");
  info("[NEXT] Run the alpha tests in this order:");
  console.log("1. npx tsx examples/managed_api_client.ts");
  console.log("2. npx tsx examples/treasury_transfer_flow.ts");
  if (!args.skipFlowTemplate) {
    console.log("3. npx tsx hrevn_test_flow.ts");
  }
}

async function main() {
  const args = parseArgs(process.argv);

  if (args.command !== "setup") {
    usage();
    process.exit(args.command ? 1 : 0);
  }

  try {
    await runSetup(args);
  } catch (error) {
    fail(
      error instanceof Error
        ? error.message
        : "Your key may be invalid or the HREVN managed service may be unavailable.",
    );
    process.exit(1);
  }
}

void main();
