import { Agent } from "@mastra/core/agent";
import { AgentNetwork } from "@mastra/core/network";
import { anthropic } from "@ai-sdk/anthropic";
import { tavilySearchTool, dataAnalysisTool } from "../tools";

// Web検索エージェントの作成
export const webSearchAgent = new Agent({
  name: "Web Search Agent",
  instructions: `
    あなたはウェブ検索の専門家です。
    与えられたトピックに関する情報を検索し、最新かつ関連性の高い情報を提供してください。
    常に信頼性の高いソースからの情報を引用し、検索結果にはソースのURLを含めてください。
    
    tavily-searchツールを使用して、リアルタイムの検索結果を取得できます。
    検索結果から適切な情報を抽出し、ユーザーにわかりやすく提示してください。
  `,
  model: anthropic("claude-3-sonnet-20240229"),
  tools: {
    "tavily-search": tavilySearchTool,
  },
});

// データ分析エージェントの作成
export const dataAnalysisAgent = new Agent({
  name: "Data Analysis Agent",
  instructions: `
    あなたはデータ分析の専門家です。
    提供されたデータを分析し、洞察と傾向を抽出してください。
    データの視覚化方法についても提案し、結論は明確かつ簡潔に伝えてください。
    
    analyze-dataツールを使用して、データの分析と洞察の抽出を行えます。
  `,
  model: anthropic("claude-3-sonnet-20240229"),
  tools: {
    "analyze-data": dataAnalysisTool,
  },
});

// コンテンツ作成エージェントの作成
export const contentCreationAgent = new Agent({
  name: "Content Creation Agent",
  instructions: `
    あなたはコンテンツ作成の専門家です。
    提供された情報とデータを基に、読みやすく魅力的なコンテンツを作成してください。
    対象読者に合わせた適切なトーンと構造を使用し、必要に応じて視覚的要素を提案してください。
  `,
  model: anthropic("claude-3-sonnet-20240229"),
});

// 研究ネットワークの作成
export const researchNetwork = new AgentNetwork({
  name: "Research Network",
  instructions: `
    あなたは様々な専門エージェントを調整して、包括的な研究を行うためのコーディネーターです。
    
    利用可能なエージェント:
    1. Web Search Agent - トピックに関する最新情報を検索します。tavily-searchツールを使用できます。
    2. Data Analysis Agent - 収集されたデータを分析して洞察を提供します。analyze-dataツールを使用できます。
    3. Content Creation Agent - 研究結果を元に魅力的なコンテンツを作成します
    
    各エージェントの専門知識を最大限に活用し、ユーザーの質問に対して包括的な回答を提供してください。
    複雑なタスクは小さな部分に分割し、適切なエージェントに割り当ててください。
    各エージェントからの結果を統合して、一貫性のある完全な回答を作成してください。
  `,
  model: anthropic("claude-3-sonnet-20240229"),
  agents: [webSearchAgent, dataAnalysisAgent, contentCreationAgent],
});
