import { Mastra } from "@mastra/core/mastra";
import { createLogger } from "@mastra/core/logger";
import { weatherWorkflow } from "./workflows/weatherWorkflow";
import { weatherAgent } from "./agents/weatherAgent";
import { researchNetwork } from "./networks/research-network";

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  networks: { researchNetwork },
  agents: { weatherAgent },
  logger: createLogger({
    name: "Mastra",
    level: "info",
  }),
});
