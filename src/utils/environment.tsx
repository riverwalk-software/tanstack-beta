import { queryOptions, useQueryClient } from "@tanstack/react-query";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { Context } from "effect";
import { z } from "zod";

const VariablesEnvironmentSchema = z.object({
  BETTER_AUTH_URL: z
    .string()
    .url({ message: "BETTER_AUTH_URL must be a valid URL" }),
  GOOGLE_CLIENT_ID: z
    .string()
    .nonempty({ message: "GOOGLE_CLIENT_ID is required" }),
  GOOGLE_REDIRECT_URI: z
    .string()
    .url({ message: "GOOGLE_REDIRECT_URI must be a valid URL" }),
});

type VariablesEnvironment = z.infer<typeof VariablesEnvironmentSchema>;

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

const renderMissingSection = (title: string, items: string[]) =>
  items.length > 0 && (
    <>
      <p className="mb-2 text-gray-700 dark:text-gray-300">{title}:</p>
      <ul className="mb-4 list-inside list-disc space-y-1">
        {items.map((envVar) => (
          <li key={envVar} className="font-mono text-red-600 dark:text-red-400">
            {envVar}
          </li>
        ))}
      </ul>
    </>
  );

interface FailedEnvironmentValidation {
  isError: true;
  errors: {
    variables?: string[];
    secrets?: string[];
  };
}

interface SuccessfulEnvironmentValidation {
  isError: false;
}

export type EnvironmentValidation =
  | FailedEnvironmentValidation
  | SuccessfulEnvironmentValidation;

const validateEnvironmentMw = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const variables = VariablesEnvironmentSchema.safeParse(process.env);
    const secrets = SecretsEnvironmentSchema.safeParse(process.env);
    return next({
      context: {
        environmentValidation: {
          variables,
          secrets,
        },
      },
    });
  },
);

const validateEnvironmentFn = createServerFn()
  .middleware([validateEnvironmentMw])
  .handler(
    async ({
      context: {
        environmentValidation: { variables, secrets },
      },
    }): Promise<EnvironmentValidation> => {
      if (variables.success && secrets.success)
        return {
          isError: false,
        };
      else
        return {
          isError: true,
          errors: {
            variables: variables.error?.issues.map(
              (issue) => `${issue.path[0]}: ${issue.message}`,
            ),
            secrets: secrets.error?.issues.map((issue) =>
              issue.path[0].toString(),
            ),
          },
        };
    },
  );

export const environmentValidationQueryOptions = queryOptions({
  queryKey: ["environmentValidation"],
  queryFn: validateEnvironmentFn,
  retry: false,
  staleTime: Infinity,
  gcTime: Infinity,
  subscribed: false,
});

export const useEnvironmentValidation = () => {
  const queryClient = useQueryClient();
  const environmentValidation = queryClient.getQueryData(
    environmentValidationQueryOptions.queryKey,
  );
  return { environmentValidation };
};

export const getEnvironmentMw = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const variables = VariablesEnvironmentSchema.parse(process.env);
    const secrets = SecretsEnvironmentSchema.parse(process.env);
    return next({
      context: { environment: { variables, secrets } },
    });
  },
);

export type Environment = {
  variables: VariablesEnvironment;
  secrets: SecretsEnvironment;
};

export class EnvironmentService extends Context.Tag("EnvironmentService")<
  EnvironmentService,
  Environment
>() {}
