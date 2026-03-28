export type ActionCategory =
  | "cloudRun"
  | "firebaseHosting"
  | "cloudDataCredentials"
  | "platformWide";

export type ActionPriority = "high" | "medium" | "low";

export interface ActionItem {
  category: ActionCategory;
  title: string;
  priority: ActionPriority;
  description: string;
  steps: string[];
  verification: string[];
  blockers?: string[];
  relatedResources?: string[];
}

export const deploymentActionItems: ActionItem[] = [
  {
    category: "cloudRun",
    title: "Complete Cloud Run environment configuration",
    priority: "high",
    description:
      "Ensure all runtime environment variables and secrets are present on both r3al-app and optima-core services.",
    steps: [
      "Open Cloud Run > r3al-app and optima-core > Variables & Secrets",
      "Add DB_USER, DB_PASSWORD, DB_NAME, CLOUD_SQL_CONNECTION_NAME, EXPO_PUBLIC_RORK_API_BASE_URL, and EXPO_PUBLIC_AI_BASE_URL if missing",
      "Prefer Secret Manager bindings for sensitive values such as DB_PASSWORD",
      "Redeploy or trigger revision after updates"
    ],
    verification: [
      "curl https://<r3al-app-url>/health returns 200 and includes database status",
      "curl https://<optima-core-url>/health returns 200",
      "curl https://<service-url>/api/routes returns route manifest without errors"
    ],
    blockers: [
      "Access to Google Cloud project with permission to edit Cloud Run environment variables",
      "Final list of environment variable values"
    ],
    relatedResources: [
      "https://cloud.google.com/run/docs/configuring/environment-variables",
      "https://cloud.google.com/run/docs/configuring/secrets"
    ]
  },
  {
    category: "cloudRun",
    title: "Validate Cloud Run logging and monitoring",
    priority: "medium",
    description:
      "Confirm Cloud Run revisions are emitting healthy logs and enable alerting for failures.",
    steps: [
      "Run gcloud logging read for r3al-app and optima-core to review the latest 50 log entries",
      "Create log-based alerts for HTTP 5xx spikes",
      "Verify request latency and error rate dashboards in Cloud Monitoring"
    ],
    verification: [
      "No authentication or missing env variable errors in logs",
      "Alerting policies active in Cloud Monitoring"
    ],
    relatedResources: [
      "https://cloud.google.com/logging/docs",
      "https://cloud.google.com/monitoring/docs"
    ]
  },
  {
    category: "firebaseHosting",
    title: "Align Firebase Hosting with live API endpoints",
    priority: "high",
    description:
      "Confirm the hosted web companion and static assets point to the new Cloud Run base URLs.",
    steps: [
      "Update firebase.json rewrites or environment configs to proxy to the Cloud Run services if needed",
      "Set EXPO_PUBLIC_RORK_API_BASE_URL and EXPO_PUBLIC_AI_BASE_URL in Firebase Hosting environment config if the web client consumes them",
      "Deploy firebase hosting after configuration changes"
    ],
    verification: [
      "firebase deploy --only hosting completes successfully",
      "Hosted web app fetches data from Cloud Run endpoints without CORS errors"
    ],
    relatedResources: [
      "https://firebase.google.com/docs/hosting/full-config",
      "https://firebase.google.com/docs/cli#runtimeconfig"
    ]
  },
  {
    category: "firebaseHosting",
    title: "Confirm custom domain and SSL status",
    priority: "medium",
    description:
      "Ensure Firebase Hosting domains are verified and SSL certificates are active.",
    steps: [
      "Visit Firebase Console > Hosting > Custom domains",
      "Verify DNS records for primary domain and ensure SSL shows Active",
      "Run firebase hosting:channel:list to remove stale preview channels"
    ],
    verification: [
      "Primary domain loads with HTTPS and no certificate warnings",
      "Preview channels cleaned or updated"
    ]
  },
  {
    category: "cloudDataCredentials",
    title: "Rotate and store Cloud SQL database credentials",
    priority: "high",
    description:
      "Generate a strong password for the Cloud SQL user and store it via Secret Manager for Cloud Run access.",
    steps: [
      "Navigate to Cloud SQL > Users and reset postgres user password",
      "Create gcloud secrets create db-password with the new value",
      "Attach the secret to r3al-app and optima-core Cloud Run services via set-secrets",
      "Record password rotation date in internal admin log"
    ],
    verification: [
      "gcloud sql connect <instance> --user=postgres succeeds",
      "Application health endpoints report successful database connection"
    ],
    relatedResources: [
      "https://cloud.google.com/sql/docs/postgres/create-manage-users",
      "https://cloud.google.com/run/docs/configuring/secrets#secret-manager"
    ]
  },
  {
    category: "cloudDataCredentials",
    title: "Audit additional data access keys",
    priority: "medium",
    description:
      "Review any API keys, OAuth credentials, or third-party secrets used by Optima AI features.",
    steps: [
      "List all secrets in Secret Manager related to Optima and R3AL",
      "Verify expiration policies and rotation cadence",
      "Document which services consume each secret"
    ],
    verification: [
      "Updated inventory of secrets with owners and rotation dates"
    ]
  },
  {
    category: "platformWide",
    title: "Run full-stack smoke test after configuration updates",
    priority: "high",
    description:
      "Validate the mobile app, web client, and backend services end-to-end after applying environment changes.",
    steps: [
      "Start Expo app with updated env and confirm login flow",
      "Exercise Pulse, Hive, Profile, and QOTD screens",
      "Monitor Cloud Run logs during the session for warnings"
    ],
    verification: [
      "No runtime crashes or missing environment errors",
      "Expo app communicates with Cloud Run routes successfully"
    ]
  },
  {
    category: "platformWide",
    title: "Update documentation with new infrastructure state",
    priority: "low",
    description:
      "Record the finalized environment variable maps, secret names, and verification commands for future reference.",
    steps: [
      "Add entries to DEPLOYMENT.md or SYSTEM_STATUS.md with the new configuration",
      "Include curl commands for health and route checks",
      "Share summary with stakeholders"
    ],
    verification: [
      "Documentation repo includes latest configuration snapshot"
    ]
  }
];

export const getActionItemsByCategory = (
  category: ActionCategory
): ActionItem[] => deploymentActionItems.filter((item) => item.category === category);
