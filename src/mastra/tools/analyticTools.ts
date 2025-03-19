import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// データ分析のためのカスタムツール例
export const dataAnalysisTool = createTool({
  id: "analyze-data",
  description: "Analyze data to extract insights and trends",
  inputSchema: z.object({
    data: z.string().describe("The data to analyze in JSON format"),
    analysis_type: z
      .enum(["basic", "advanced", "predictive"])
      .optional()
      .describe("The type of analysis to perform"),
  }),
  outputSchema: z.object({
    insights: z.string(),
    visualization_suggestions: z.array(z.string()),
  }),
  execute: async ({ context }) => {
    // 注意: これは模擬的な実装です
    const data = context.data;
    const analysis_type = context.analysis_type || "basic";

    console.log(`データ分析: ${analysis_type}`);

    return {
      insights: `「${data}」に対する分析結果です。${analysis_type}分析の結果を示しています。`,
      visualization_suggestions: [
        "棒グラフ: 主要指標を比較するため",
        "折れ線グラフ: 時間に伴う傾向を示すため",
      ],
    };
  },
});
