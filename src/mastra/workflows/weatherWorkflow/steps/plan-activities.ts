import { Step } from "@mastra/core/workflows";
import { z } from "zod";
import { weatherAgent } from "../agents/weather-agent";
import { forecastSchema } from "./fetch-weather";

export const planActivities = new Step({
  id: "plan-activities",
  description: "Suggests activities based on weather conditions",
  inputSchema: forecastSchema,
  execute: async ({ context, mastra }) => {
    const forecast =
      context?.getStepResult<z.infer<typeof forecastSchema>>("fetch-weather");

    if (!forecast || forecast.length === 0) {
      throw new Error("Forecast data not found");
    }

    const prompt = `Based on the following weather forecast for ${forecast[0]?.location}, suggest appropriate activities:
      ${JSON.stringify(forecast, null, 2)}
      `;

    const response = await weatherAgent.stream([
      {
        role: "user",
        content: prompt,
      },
    ]);

    let activitiesText = "";

    for await (const chunk of response.textStream) {
      process.stdout.write(chunk);
      activitiesText += chunk;
    }

    return {
      activities: activitiesText,
    };
  },
});
