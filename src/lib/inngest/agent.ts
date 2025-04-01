import {
  createNetwork,
  openai,
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
  defaultModel: openai({
    model: "gpt-4o-mini",
    defaultParameters: {
      max_completion_tokens: 1000,
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
    `Extract the key information from this receipt ${event.data.url}. We want the name of the establishment, the date, the total amount spent, and the individual items. You should format it in the following way:
    {
        establishment: xxx,
        date: xxx,
        total amount: xxx
        items: [
            {
            name: xxx,
            quantity (if applicable): xxx
            price: xxx
        }
        ]
    }
    Once the information has successfully been extracted, and saved to the database, you can terminate the agent.
    `;
  },
);
