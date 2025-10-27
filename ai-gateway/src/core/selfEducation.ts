import fs from "fs";
import path from "path";
import { EthicsEngine } from "./ethics.js";
import { ForesightModule } from "./foresight.js";

interface JournalEntry {
  timestamp: string;
  prompt: string;
  aligned: string;
  projection: string;
}

export class SelfEducation {
  private ethics = new EthicsEngine();
  private foresight = new ForesightModule();
  private logPath: string = path.resolve("logs/foresight_journal.json");

  constructor() {
    this.ensureLogFile();
  }

  private ensureLogFile() {
    try {
      const dir = path.dirname(this.logPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      if (!fs.existsSync(this.logPath))
        fs.writeFileSync(this.logPath, JSON.stringify([]));
    } catch (e) {
      console.error("Failed to initialize self-education log:", e);
    }
  }

  public async recordInsight(prompt: string, response: string): Promise<string> {
    const projection = this.foresight.projectPath([prompt, response]);
    const aligned = this.ethics.infuse(response);

    const entry: JournalEntry = {
      timestamp: new Date().toISOString(),
      prompt,
      aligned,
      projection,
    };

    try {
      const raw = fs.readFileSync(this.logPath, "utf-8");
      const data: JournalEntry[] = raw ? JSON.parse(raw) : [];
      data.push(entry);
      fs.writeFileSync(this.logPath, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error("Failed to write self-education entry:", e);
    }

    return projection;
  }

  public async periodicReflection(): Promise<string> {
    try {
      const raw = fs.readFileSync(this.logPath, "utf-8");
      const data: JournalEntry[] = raw ? JSON.parse(raw) : [];
      const summary = data.slice(-5).map((d) => d.projection);
      return `🕊 Optima's latest reflections:\n${summary.join("\n")}`;
    } catch (e) {
      console.error("Failed to read reflections:", e);
      return "🕊 No reflections available yet.";
    }
  }
}
