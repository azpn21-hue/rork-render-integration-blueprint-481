import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { analyzeHive } from "../core/hive.js";

const router = express.Router();
const AUTH_KEY = process.env.EXPORT_AUTH_KEY || "supersecretkey";

function safeReadJSON(file: string): any[] {
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return [];
  }
}

router.get("/hive", async (req: Request, res: Response) => {
  try {
    if (req.query.auth !== AUTH_KEY)
      return res.status(401).json({ error: "Unauthorized" });

    const hiveData = analyzeHive();
    const hiveEntries = safeReadJSON(path.resolve("./hive.json"));

    const payload = {
      type: "hive",
      timestamp: new Date().toISOString(),
      hiveStats: hiveData,
      entries: hiveEntries,
    };

    res.setHeader("Content-Disposition", "attachment; filename=hive-export.json");
    res.json(payload);
  } catch (e) {
    console.error("Hive export error:", e);
    res.status(500).json({ error: (e as Error).message });
  }
});

router.get("/trust", async (req: Request, res: Response) => {
  try {
    if (req.query.auth !== AUTH_KEY)
      return res.status(401).json({ error: "Unauthorized" });

    const trustFile = path.resolve("./trustVault.json");
    const trustData = safeReadJSON(trustFile);

    const payload = {
      type: "trustVault",
      timestamp: new Date().toISOString(),
      entries: trustData,
    };

    res.setHeader("Content-Disposition", "attachment; filename=trust-export.json");
    res.json(payload);
  } catch (e) {
    console.error("Trust export error:", e);
    res.status(500).json({ error: (e as Error).message });
  }
});

router.get("/circles", async (req: Request, res: Response) => {
  try {
    if (req.query.auth !== AUTH_KEY)
      return res.status(401).json({ error: "Unauthorized" });

    const circleFile = path.resolve("./circleRegistry.json");
    const circleData = safeReadJSON(circleFile);

    const payload = {
      type: "circles",
      timestamp: new Date().toISOString(),
      entries: circleData,
    };

    res.setHeader("Content-Disposition", "attachment; filename=circles-export.json");
    res.json(payload);
  } catch (e) {
    console.error("Circle export error:", e);
    res.status(500).json({ error: (e as Error).message });
  }
});

export default router;
Add export API for Hive, TrustVault, and Circles
