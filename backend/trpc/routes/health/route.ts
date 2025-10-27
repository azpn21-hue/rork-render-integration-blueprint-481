import { publicProcedure } from "../../create-context";

export const healthProcedure = publicProcedure.query(() => {
  return {
    status: "ok",
    message: "R3AL Connection API is running",
    timestamp: new Date().toISOString(),
  };
});

export default healthProcedure;
