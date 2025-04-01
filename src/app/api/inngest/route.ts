import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { extractAndSave } from "@/lib/inngest/agent";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [extractAndSave],
});
