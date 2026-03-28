import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import loginRoute from "./routes/auth/login/route";
import registerRoute from "./routes/auth/register/route";
import healthRoute from "./routes/health/route";
import { r3alRouter } from "./routes/r3al/router";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  auth: createTRPCRouter({
    login: loginRoute,
    register: registerRoute,
  }),
  health: healthRoute,
  r3al: r3alRouter,
});

export type AppRouter = typeof appRouter;
