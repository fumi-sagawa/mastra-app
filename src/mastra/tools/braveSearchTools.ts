import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import fetch from "node-fetch";

// Braveの検索ツールを実装したカスタムツール
export const braveSearchTool = createTool({
  id: "brave-search",
  description:
    "Search the web for real-time information on a given topic using Brave Search API",
  // ツールのスキーマ定義
  inputSchema: z.object({
    query: z.string().describe("検索クエリ"),
    count: z.number().optional().describe("返される検索結果の数"),
    offset: z.number().optional().describe("検索結果のオフセット"),
    country: z.string().optional().describe("国コード（例: JP, US）"),
    language: z.string().optional().describe("言語コード（例: ja, en）"),
  }),
  outputSchema: z.object({
    results: z.array(
      z.object({
        title: z.string(),
        url: z.string(),
        description: z.string(),
      })
    ),
  }),
  // 実際のBrave Search APIを呼び出す実装
  execute: async ({ context }) => {
    const BRAVE_API_KEY = process.env.BRAVE_API_KEY;

    if (!BRAVE_API_KEY) {
      throw new Error(
        "Brave API キーが設定されていません。環境変数 BRAVE_API_KEY を設定してください。"
      );
    }

    const baseUrl = "https://api.search.brave.com/res/v1/web/search";

    // クエリパラメータの構築
    const params = new URLSearchParams({
      q: context.query,
    });

    // オプションパラメータの追加
    if (context.count) params.append("count", context.count.toString());
    if (context.offset) params.append("offset", context.offset.toString());
    if (context.country) params.append("country", context.country);
    if (context.language) params.append("language", context.language);

    const url = `${baseUrl}?${params.toString()}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
          "X-Subscription-Token": BRAVE_API_KEY,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Brave API エラー: ${response.status} ${errorText}`);
      }

      // レスポンスの型を定義
      interface BraveResponse {
        web?: {
          results?: Array<{
            title: string;
            url: string;
            description: string;
          }>;
        };
      }

      const data = (await response.json()) as BraveResponse;

      // 検索結果がない場合は空配列を返す
      const searchResults = data.web?.results || [];

      return {
        results: searchResults.map((result) => ({
          title: result.title,
          url: result.url,
          description: result.description,
        })),
      };
    } catch (error: unknown) {
      console.error("Brave検索中にエラーが発生しました:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Brave検索中にエラーが発生しました: ${errorMessage}`);
    }
  },
});
