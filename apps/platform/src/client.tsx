import { init } from "@sentry/tanstackstart-react"
import { StartClient } from "@tanstack/react-start"
import { StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"
import { createRouter } from "#router.js"

const router = createRouter()

init({
  dsn: "https://0fbe838a28cb6fad1356d8ea1653867d@o4506510291697664.ingest.us.sentry.io/4510058911957000",

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
})

hydrateRoot(
  document,
  <StrictMode>
    <StartClient router={router} />
  </StrictMode>,
)
