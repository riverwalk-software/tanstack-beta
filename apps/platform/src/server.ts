import { init, wrapStreamHandlerWithSentry } from "@sentry/tanstackstart-react"
import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server"
import { createRouter } from "#router.js"

init({
  dsn: "https://0fbe838a28cb6fad1356d8ea1653867d@o4506510291697664.ingest.us.sentry.io/4510058911957000",

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
})

// oxlint-disable-next-line no-default-export
export default createStartHandler({
  createRouter,
})(wrapStreamHandlerWithSentry(defaultStreamHandler))
