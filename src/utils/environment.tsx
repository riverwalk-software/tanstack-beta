import { queryOptions, useQueryClient } from "@tanstack/react-query";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { Context } from "effect";
import { z } from "zod";

const VariablesEnvironmentSchema = z.object({
  BETTER_AUTH_URL: z.string().url(),
});

type VariablesEnvironment = z.infer<typeof VariablesEnvironmentSchema>;

const SecretsEnvironmentSchema = z.object({
  BETTER_AUTH_SECRET: z.string().nonempty(),
  BUNNY_TOKEN_API_KEY: z.string().nonempty(),
  CLOUDFLARE_ACCOUNT_ID: z.string().nonempty(),
  CLOUDFLARE_D1_TOKEN: z.string().nonempty(),
  CLOUDFLARE_DATABASE_ID: z.string().nonempty(),
  RESEND_API_KEY: z.string().nonempty(),
});

type SecretsEnvironment = z.infer<typeof SecretsEnvironmentSchema>;

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

interface FailedEnvironmentValidation {
  isError: true;
  errors: {
    variables?: string[];
    secrets?: string[];
  };
}

interface SuccessfulEnvironmentValidation {
  isError: false;
  errors: null;
}

export type EnvironmentValidation =
  | FailedEnvironmentValidation
  | SuccessfulEnvironmentValidation;

const getEnvironmentValidationFn = createServerFn().handler(
  async (): Promise<EnvironmentValidation> => {
    const variables = VariablesEnvironmentSchema.safeParse(process.env);
    const secrets = SecretsEnvironmentSchema.safeParse(process.env);
    return variables.success && secrets.success
      ? ({
          isError: false,
          errors: null,
        } as const)
      : ({
          isError: true,
          errors: {
            variables: variables.error?.issues.map(
              (issue) => `${String(issue.path[0])}: ${issue.message}`,
            ),
            secrets: secrets.error?.issues.map((issue) =>
              issue.path[0].toString(),
            ),
          },
        } as const);
  },
);

export const environmentValidationQueryOptions = queryOptions({
  queryKey: ["environmentValidation"],
  queryFn: getEnvironmentValidationFn,
  staleTime: Infinity,
  gcTime: Infinity,
  subscribed: false,
});

export const getEnvironmentMw = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    return next<{
      environment: Environment;
    }>({
      context: { environment },
    });
  },
);

type Environment = {
  variables: VariablesEnvironment;
  secrets: SecretsEnvironment;
};

export const environment: Environment = {
  variables: process.env as VariablesEnvironment,
  secrets: process.env as SecretsEnvironment,
};

export class EnvironmentService extends Context.Tag("EnvironmentService")<
  EnvironmentService,
  Environment
>() {}

export const useEnvironmentValidation = () => {
  const queryClient = useQueryClient();
  const environmentValidation = queryClient.getQueryData(
    environmentValidationQueryOptions.queryKey,
  );
  return { environmentValidation };
};
