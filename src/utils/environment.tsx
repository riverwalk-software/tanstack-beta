import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export function EnvironmentError({
  errors: { variables, secrets },
}: EnvironmentValidation) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-950">
      <div className="max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">
          Environment Configuration Error
        </h1>
        {variables && renderMissingSection("Variables", variables)}
        {secrets && renderMissingSection("Secrets", secrets)}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Please check your environment configuration.
        </p>
      </div>
    </div>
  );
}

const renderMissingSection = (title: string, items: string[]) =>
  items.length > 0 && (
    <>
      <p className="text-gray-700 dark:text-gray-300 mb-2">{title}:</p>
      <ul className="list-disc list-inside space-y-1 mb-4">
        {items.map((envVar) => (
          <li key={envVar} className="text-red-600 dark:text-red-400 font-mono">
            {envVar}
          </li>
        ))}
      </ul>
    </>
  );

const VariablesEnvironmentSchema = z.object({
  BETTER_AUTH_URL: z
    .string()
    .url({ message: "BETTER_AUTH_URL must be a valid URL" }),
  // GOOGLE_CLIENT_ID: z
  //   .string()
  //   .nonempty({ message: "GOOGLE_CLIENT_ID is required" }),
  // GOOGLE_REDIRECT_URI: z
  //   .string()
  //   .url({ message: "GOOGLE_REDIRECT_URI must be a valid URL" }),
});

const SecretsEnvironmentSchema = z.object({
  BETTER_AUTH_SECRET: z
    .string()
    .nonempty({ message: "BETTER_AUTH_SECRET is required" }),
  // GOOGLE_CLIENT_SECRET: z
  //   .string()
  //   .nonempty({ message: "GOOGLE_CLIENT_SECRET is required" }),
  // RESEND_API_KEY: z
  //   .string()
  //   .nonempty({ message: "RESEND_API_KEY is required" }),
});

export interface EnvironmentValidation {
  isValid: boolean;
  errors: {
    variables?: string[];
    secrets?: string[];
  };
}

export const validateEnvironmentFn = createServerFn().handler(
  async (): Promise<EnvironmentValidation> => {
    const [variables, secrets] = [
      VariablesEnvironmentSchema.safeParse(process.env),
      SecretsEnvironmentSchema.safeParse(process.env),
    ];

    return {
      isValid: variables.success && secrets.success,
      errors: {
        variables: variables.error?.issues.map(
          (issue) => `${issue.path[0]}: ${issue.message}`,
        ),
        secrets: secrets.error?.issues.map((issue) => issue.path[0].toString()),
      },
    };
  },
);
