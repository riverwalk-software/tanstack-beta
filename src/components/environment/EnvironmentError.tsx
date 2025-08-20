import type { FailedEnvironmentValidation } from "@/lib/environment";

export function EnvironmentError({
  errors: { variables, secrets },
}: FailedEnvironmentValidation) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-red-50 dark:bg-red-950">
      <div className="max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <h1 className="mb-4 font-bold text-red-600 text-xl dark:text-red-400">
          Environment Configuration Error
        </h1>
        {variables && renderMissingSection("Variables", variables)}
        {secrets && renderMissingSection("Secrets", secrets)}
        <p className="text-gray-600 text-sm dark:text-gray-400">
          Please check your environment configuration.
        </p>
      </div>
    </div>
  );
}

function renderMissingSection(title: string, items: string[]) {
  return (
    items.length > 0 && (
      <>
        <p className="mb-2 text-gray-700 dark:text-gray-300">{title}:</p>
        <ul className="mb-4 list-inside list-disc space-y-1">
          {items.map((envVar) => (
            <li
              key={envVar}
              className="font-mono text-red-600 dark:text-red-400"
            >
              {envVar}
            </li>
          ))}
        </ul>
      </>
    )
  );
}
