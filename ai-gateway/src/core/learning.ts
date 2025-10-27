import { EthicsEngine } from "./ethics.js";
import { ForesightModule } from "./foresight.js";
import { invokeAnthropic } from "../providers/anthropic.js";

export async function handleAIRequest(
  data: any,
  ethics: EthicsEngine,
  foresight: ForesightModule
) {
  const prompt: string = typeof data?.prompt === "string" ? data.prompt : "";
  if (!prompt) throw new Error("Missing prompt");

  if (!ethics.validateIntent(prompt)) {
    throw new Error("Prompt rejected: unethical content detected.");
  }

  const infused = ethics.infuse(prompt);
  const result = await invokeAnthropic(infused);
  const projection = foresight.projectPath([infused]);

  return `${result}\n\n${projection}`;
}
