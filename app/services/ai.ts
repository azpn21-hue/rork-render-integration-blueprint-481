export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatOptions {
  temperature?: number;
  max_tokens?: number;
  model?: string;
}

export async function* streamChat(
  messages: ChatMessage[],
  options?: ChatOptions
): AsyncGenerator<string, void, unknown> {
  const aiBaseUrl = process.env.EXPO_PUBLIC_AI_BASE_URL || "http://localhost:9000";

  const response = await fetch(`${aiBaseUrl}/v1/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      stream: true,
      ...options,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI Gateway error: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Response body is not readable");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data:")) {
          const payload = line.slice(5).trim();
          if (payload === "[DONE]") {
            return;
          }

          try {
            const json = JSON.parse(payload);
            if (json.delta) {
              yield json.delta;
            } else if (json.content) {
              yield json.content;
            }
          } catch {
            continue;
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export async function chatCompletion(
  messages: ChatMessage[],
  options?: ChatOptions
): Promise<string> {
  let fullResponse = "";
  
  for await (const chunk of streamChat(messages, options)) {
    fullResponse += chunk;
  }
  
  return fullResponse;
}

export async function feedOptimaMemory(data: Record<string, unknown>): Promise<{ success: boolean }>{
  const apiBase = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || "http://localhost:10000";
  try {
    const resp = await fetch(`${apiBase}/ai/memory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!resp.ok) {
      console.log("feedOptimaMemory upstream status", resp.status);
      return { success: false };
    }
    return { success: true };
  } catch (err) {
    console.log("feedOptimaMemory error", err);
    return { success: false };
  }
}

export type TruthScoreResponse = {
  success: boolean;
  score: number;
  tier: string;
  nextGoal: string;
} | { success: false; score?: number; tier?: string; nextGoal?: string };

export async function getTruthScore(userId: string): Promise<TruthScoreResponse> {
  try {
    const aiBase = process.env.EXPO_PUBLIC_AI_BASE_URL || "http://localhost:9000";
    const res = await fetch(`${aiBase}/rewards/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    
    if (!res.ok) {
      console.error("getTruthScore HTTP error:", res.status);
      return { success: false };
    }
    
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error("getTruthScore non-JSON response:", text.substring(0, 100));
      return { success: false };
    }
    
    const data = await res.json();
    return data as TruthScoreResponse;
  } catch (err) {
    console.error("getTruthScore error:", err);
    return { success: false };
  }
}

export interface ApiConnectivityStatus {
  aiGateway: {
    reachable: boolean;
    status?: number;
    attemptedUrls: string[];
    error?: string;
  };
  coreGateway: {
    reachable: boolean;
    status?: number;
    attemptedUrls: string[];
    error?: string;
  };
}

async function verifyEndpoint(baseUrl: string, candidatePaths: string[]): Promise<{
  reachable: boolean;
  status?: number;
  attemptedUrls: string[];
  error?: string;
}> {
  const attemptedUrls: string[] = [];
  for (const path of candidatePaths) {
    const url = `${baseUrl}${path}`;
    attemptedUrls.push(url);
    console.log("verifyEndpoint probing", url);
    try {
      const response = await fetch(url, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("verifyEndpoint response", url, response.status);
      if (response.ok) {
        return { reachable: true, status: response.status, attemptedUrls };
      }
    } catch (error) {
      console.log("verifyEndpoint error", url, error);
      return {
        reachable: false,
        attemptedUrls,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
  return { reachable: false, attemptedUrls };
}

export async function verifyApiConnectivity(): Promise<ApiConnectivityStatus> {
  const aiBase = process.env.EXPO_PUBLIC_AI_BASE_URL || "http://localhost:9000";
  const coreBase = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || "http://localhost:10000";
  console.log("verifyApiConnectivity start", { aiBase, coreBase });
  const [aiGateway, coreGateway] = await Promise.all([
    verifyEndpoint(aiBase, ["/health", "/api/health", "/healthz"]),
    verifyEndpoint(coreBase, ["/health", "/api/health", "/healthz"]),
  ]);
  console.log("verifyApiConnectivity result", { aiGateway, coreGateway });
  return { aiGateway, coreGateway };
}
