import { createTool } from "@mastra/core/tools";
import { z } from "zod";

// データ分析ツールの実装
export const dataAnalysisTool = createTool({
  id: "analyze-data",
  description: "Analyze provided data and generate insights",
  // ツールのスキーマ定義
  inputSchema: z.object({
    data: z.string().describe("JSON形式のデータまたはCSV形式のデータ"),
    analysisType: z
      .enum(["summary", "trends", "correlations", "forecast"])
      .optional()
      .describe("実行する分析のタイプ"),
    format: z.enum(["json", "csv"]).optional().describe("入力データの形式"),
  }),
  outputSchema: z.object({
    insights: z.array(z.string()),
    statistics: z.record(z.string(), z.unknown()),
    visualizationSuggestions: z.array(z.string()).optional(),
  }),
  // 実際のデータ分析実装
  execute: async ({ context }) => {
    try {
      // データの形式を判断
      const format =
        context.format ||
        (context.data.trim().startsWith("{") ? "json" : "csv");

      // データの解析（簡易実装）
      let parsedData: any;
      if (format === "json") {
        try {
          parsedData = JSON.parse(context.data);
        } catch (e) {
          throw new Error(
            "JSONデータの解析に失敗しました。有効なJSON形式であることを確認してください。"
          );
        }
      } else {
        // CSV解析の簡易実装（実際のプロジェクトではより堅牢なCSVパーサーを使用することをお勧めします）
        parsedData = context.data
          .split("\n")
          .map((line) => line.split(","))
          .filter((line) => line.length > 0);
      }

      // 分析タイプに基づく処理
      const analysisType = context.analysisType || "summary";

      // 簡易的な分析結果（実際のプロジェクトではより高度な分析ロジックを実装してください）
      const insights: string[] = [];
      const statistics: Record<string, unknown> = {};

      // サマリー分析（すべての分析タイプで実行）
      if (format === "json") {
        if (Array.isArray(parsedData)) {
          statistics.count = parsedData.length;
          insights.push(
            `データセットには${parsedData.length}件のレコードが含まれています。`
          );

          // 最初のオブジェクトからキーを抽出
          if (parsedData.length > 0 && typeof parsedData[0] === "object") {
            const keys = Object.keys(parsedData[0]);
            statistics.fields = keys;
            insights.push(
              `データには以下のフィールドがあります: ${keys.join(", ")}`
            );
          }
        } else if (typeof parsedData === "object") {
          const keys = Object.keys(parsedData);
          statistics.fields = keys;
          insights.push(`データには以下のキーがあります: ${keys.join(", ")}`);
        }
      } else if (format === "csv") {
        if (parsedData.length > 1) {
          const headers = parsedData[0];
          statistics.fields = headers;
          statistics.count = parsedData.length - 1; // ヘッダー行を除く
          insights.push(
            `データセットには${statistics.count}件のレコードが含まれています。`
          );
          insights.push(
            `データには以下のフィールドがあります: ${headers.join(", ")}`
          );
        }
      }

      // 追加の分析タイプ別処理
      switch (analysisType) {
        case "trends":
          insights.push(
            "傾向分析: データセットは時系列での変化傾向を示しています（詳細な実装が必要です）"
          );
          break;
        case "correlations":
          insights.push(
            "相関分析: データセット内の変数間の相関を計算しました（詳細な実装が必要です）"
          );
          break;
        case "forecast":
          insights.push(
            "予測分析: 将来のデータポイントを予測しました（詳細な実装が必要です）"
          );
          break;
      }

      // 視覚化の提案
      const visualizationSuggestions = [
        `このデータセットは${analysisType === "trends" ? "時系列グラフ" : "棒グラフまたは円グラフ"}での視覚化が適しています。`,
        "データの分布をヒストグラムで表示することで、パターンがより明確になります。",
      ];

      return {
        insights,
        statistics,
        visualizationSuggestions,
      };
    } catch (error: unknown) {
      console.error("データ分析中にエラーが発生しました:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`データ分析中にエラーが発生しました: ${errorMessage}`);
    }
  },
});
