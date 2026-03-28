import fs from "fs";
import path from "path";
import { EthicsEngine } from "./ethics.js";
import { ForesightModule } from "./foresight.js";

export interface JournalEntry {
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

  private readAll(): JournalEntry[] {
    try {
      const raw = fs.readFileSync(this.logPath, "utf-8");
      return raw ? (JSON.parse(raw) as JournalEntry[]) : [];
    } catch (e) {
      console.error("Failed to read journal:", e);
      return [];
    }
  }

  private writeAll(entries: JournalEntry[]) {
    try {
      fs.writeFileSync(this.logPath, JSON.stringify(entries, null, 2));
    } catch (e) {
      console.error("Failed to write journal:", e);
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

    const data = this.readAll();
    data.push(entry);
    this.writeAll(data);

    return projection;
  }

  public async periodicReflection(): Promise<string> {
    const data = this.readAll();
    const summary = data.slice(-5).map((d) => d.projection);
    return `🕊 Optima's latest reflections:\n${summary.join("\n")}`;
  }

  public list(options?: { limit?: number; offset?: number }): JournalEntry[] {
    const { limit = 50, offset = 0 } = options ?? {};
    const data = this.readAll();
    return data.slice(Math.max(0, offset), Math.max(0, offset) + Math.max(0, limit));
  }

  public stats(): { total: number; lastTimestamp?: string } {
    const data = this.readAll();
    return {
      total: data.length,
      lastTimestamp: data.length ? data[data.length - 1]?.timestamp : undefined,
    };
  }

  public getLogPath(): string {
    return this.logPath;
  }
}
