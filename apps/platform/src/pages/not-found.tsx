import { Link } from "@tanstack/react-router"
import type { JSX, ReactNode } from "react"

function NotFound({ children }: { children?: ReactNode }): JSX.Element {
  return (
    <div className="space-y-2 p-2">
      <div className="text-gray-600 dark:text-gray-400">
        {children || <p>The page you are looking for does not exist.</p>}
      </div>
      <p className="flex items-center gap-2 flex-wrap">
        <button
          className="bg-emerald-500 text-white px-2 py-1 rounded uppercase font-black text-sm"
          onClick={() => globalThis.history.back()}
          type="button"
        >
          Go back
        </button>
        <Link
          className="bg-cyan-600 text-white px-2 py-1 rounded uppercase font-black text-sm"
          to="/"
        >
          Start Over
        </Link>
      </p>
    </div>
  )
}

export { NotFound }
