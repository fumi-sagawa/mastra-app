import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import fetch from "node-fetch";

// Tavilyの検索ツールを実装したカスタムツール
export const tavilySearchTool = createTool({
  id: "tavily-search",
  description: "Search the web for real-time information on a given topic",
  // ツールのスキーマ定義
  inputSchema: z.object({
    query: z.string().describe("The search query to look up"),
    search_depth: z
      .enum(["basic", "advanced"])
      .optional()
      .describe("The depth of the search (basic or advanced)"),
    include_domains: z
      .array(z.string())
      .optional()
      .describe("Specific domains to include in the search"),
    exclude_domains: z
      .array(z.string())
      .optional()
      .describe("Specific domains to exclude from the search"),
  }),
  outputSchema: z.object({
    results: z.array(
      z.object({
        title: z.string(),
        url: z.string(),
        content: z.string(),
      })
    ),
    answer: z.string(),
  }),
  // 実際のTavily APIを呼び出す実装
  execute: async ({ context }) => {
    const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

    if (!TAVILY_API_KEY) {
      throw new Error(
        "Tavily API キーが設定されていません。環境変数 TAVILY_API_KEY を設定してください。"
      );
    }

    const url = "https://api.tavily.com/search";

    // リクエストボディの作成
    const requestBody = {
      query: context.query,
      search_depth: context.search_depth || "basic",
      include_domains: context.include_domains || [],
      exclude_domains: context.exclude_domains || [],
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TAVILY_API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Tavily API エラー: ${response.status} ${errorText}`);
      }

      // レスポンスの型を定義
      interface TavilyResponse {
        results: Array<{
          title: string;
          url: string;
          content: string;
        }>;
        answer: string;
      }

      const data = (await response.json()) as TavilyResponse;

      return {
        results: data.results || [],
        answer: data.answer || "",
      };
    } catch (error: unknown) {
      console.error("Tavily検索中にエラーが発生しました:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Tavily検索中にエラーが発生しました: ${errorMessage}`);
    }
  },
});
