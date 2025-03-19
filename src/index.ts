import dotenv from "dotenv";
import { researchNetwork } from "./mastra/networks";

// 環境変数の読み込み
dotenv.config({ path: ".env.development" });

async function main() {
  try {
    console.log("研究ネットワークを使って著名なAI研究者についてリサーチ中...");
    const result = await researchNetwork.generate(
      "AI Agentで著名な方を調査してください"
    );
    console.log("\n=== 結果 ===\n");
    console.log(result.text);
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
}

main();
