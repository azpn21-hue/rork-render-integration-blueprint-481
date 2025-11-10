import { Hono } from "hono";
import { pool } from "../db/config";

type LeadType = "founding_member" | "investor" | "contact";

type LeadPayload = {
  name?: string;
  email?: string;
  message?: string;
};

const foundingMemberRoute = new Hono();

const parsePayload = async (jsonFetcher: () => Promise<unknown>): Promise<LeadPayload> => {
  try {
    const body = await jsonFetcher();
    if (body && typeof body === "object") {
      const { name, email, message } = body as Record<string, unknown>;
      return {
        name: typeof name === "string" ? name : undefined,
        email: typeof email === "string" ? email : undefined,
        message: typeof message === "string" ? message : undefined,
      };
    }
    return {};
  } catch (error) {
    console.error("[FoundingMemberRoute] Failed to parse payload", error);
    return {};
  }
};

const requireEmail = (email: string | undefined) => {
  if (!email || email.trim().length === 0) {
    return false;
  }
  return true;
};

const insertLead = async (type: LeadType, payload: LeadPayload) => {
  console.log("[FoundingMemberRoute] Inserting lead", { type, email: payload.email });
  const result = await pool.query(
    "INSERT INTO leads (type, name, email, message) VALUES ($1, $2, $3, $4) RETURNING id",
    [type, payload.name ?? null, payload.email ?? null, payload.message ?? null]
  );
  return result.rows[0]?.id as number | undefined;
};

const handleLeadSubmission = async (type: LeadType, payload: LeadPayload) => {
  if (!requireEmail(payload.email)) {
    return {
      status: 400,
      body: { success: false, message: "Email is required." },
    } as const;
  }
  try {
    const leadId = await insertLead(type, payload);
    if (!leadId) {
      console.error("[FoundingMemberRoute] Insert returned no id", { type, payload });
      return {
        status: 500,
        body: { success: false, message: "Failed to store lead." },
      } as const;
    }
    return {
      status: 200,
      body: { success: true, message: "Submission received.", id: leadId },
    } as const;
  } catch (error) {
    console.error("[FoundingMemberRoute] Insert failed", error);
    return {
      status: 500,
      body: { success: false, message: "Internal Server Error." },
    } as const;
  }
};

foundingMemberRoute.post("/api/founding-member", async (c) => {
  console.log("[FoundingMemberRoute] POST /api/founding-member received");
  const payload = await parsePayload(() => c.req.json());
  const response = await handleLeadSubmission("founding_member", payload);
  return c.json(response.body, response.status);
});

foundingMemberRoute.post("/api/investor", async (c) => {
  console.log("[FoundingMemberRoute] POST /api/investor received");
  const payload = await parsePayload(() => c.req.json());
  const response = await handleLeadSubmission("investor", payload);
  return c.json(response.body, response.status);
});

foundingMemberRoute.post("/api/contact", async (c) => {
  console.log("[FoundingMemberRoute] POST /api/contact received");
  const payload = await parsePayload(() => c.req.json());
  const response = await handleLeadSubmission("contact", payload);
  return c.json(response.body, response.status);
});

export default foundingMemberRoute;
