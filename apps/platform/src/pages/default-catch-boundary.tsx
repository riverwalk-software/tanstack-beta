import {
  captureException,
  withErrorBoundary,
} from "@sentry/tanstackstart-react"
import {
  ErrorComponent,
  type ErrorComponentProps,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from "@tanstack/react-router"
import type { JSX } from "react"

function UnmonitoredDefaultCatchBoundary({
  error,
}: ErrorComponentProps): JSX.Element {
  const router = useRouter()
  const isRoot = useMatch({
    strict: false,
    select: state => state.id === rootRouteId,
  })

  captureException(error)

  return (
    <div className="min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6">
      <ErrorComponent error={error} />
      <div className="flex gap-2 items-center flex-wrap">
        <button
          className="px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold"
          onClick={() => {
            router.invalidate()
          }}
          type="button"
        >
          Try Again
        </button>
        {isRoot ? (
          <Link
            className="px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold"
            to="/"
          >
            Home
          </Link>
        ) : (
          <Link
            className="px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold"
            onClick={e => {
              e.preventDefault()
              // oxlint-disable-next-line prefer-global-this
              window.history.back()
            }}
            to="/"
          >
            Go Back
          </Link>
        )}
      </div>
    </div>
  )
}

const DefaultCatchBoundary = withErrorBoundary(
  UnmonitoredDefaultCatchBoundary,
  {
    // ... sentry error wrapper options
  },
)

export { DefaultCatchBoundary }
