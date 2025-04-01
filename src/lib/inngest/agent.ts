import {
  createNetwork,
  openai,
  anthropic,
  getDefaultRoutingAgent,
  type Network,
} from "@inngest/agent-kit";
import { createServer } from "@inngest/agent-kit/server";

import { inngest } from "@/lib/inngest/client";
import { EXTRACT_FROM_RECEIPT_AND_SAVE_TO_DB } from "./constants";

import { databaseAgent } from "./agents/database-agent";
import { receiptScanAgent } from "./agents/receipt-scan-agent";

type NetworkState = {
  savedToDatabase?: boolean;
  receiptId?: string;
};

const agentNetwork = createNetwork({
  name: "Scanning Agents",
  agents: [databaseAgent, receiptScanAgent],
  defaultModel: anthropic({
    model: "claude-3-5-sonnet-latest",
    defaultParameters: {
      max_tokens: 1000,
    },
  }),
  defaultRouter: ({ network }: { network: Network<NetworkState> }) => {
    return getDefaultRoutingAgent();
  },
});

export const server = createServer({
  agents: [databaseAgent, receiptScanAgent],
  networks: [agentNetwork],
});

export const extractAndSave = inngest.createFunction(
  { id: "Extract from receipt" },
  { event: EXTRACT_FROM_RECEIPT_AND_SAVE_TO_DB },
  async ({ event }) => {
    const { url, id } = event.data;
    console.log("Using URL:", url);

    // Run the network with a structured input
    return await agentNetwork.run(
      JSON.stringify({
        type: "process-receipt",
        data: {
          filePath: url,
          id,
          status: "pending",
          updatedAt: new Date(),
        },
      }),
    );
  },
);
