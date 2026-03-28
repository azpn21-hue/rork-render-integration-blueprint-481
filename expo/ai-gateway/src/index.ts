import { startGateway } from "./server/gateway.js";
import { checkDependencies } from "./utils/dependencyCheck.js";

(async () => {
  const { hasMissingCritical } = await checkDependencies();
  if (hasMissingCritical) {
    console.error("Critical dependencies missing. Aborting start.");
    process.exit(1);
  }
  startGateway();
})();
