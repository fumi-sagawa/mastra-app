import { Workflow } from "@mastra/core/workflows";
import { z } from "zod";
import { fetchWeather } from "./steps/fetch-weather";
import { planActivities } from "./steps/plan-activities";

const weatherWorkflow = new Workflow({
  name: "weather-workflow",
  triggerSchema: z.object({
    city: z.string().describe("The city to get the weather for"),
  }),
})
  .step(fetchWeather)
  .then(planActivities);

weatherWorkflow.commit();

export { weatherWorkflow };
