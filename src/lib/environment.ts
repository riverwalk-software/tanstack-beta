import { queryOptions } from "@tanstack/react-query";
import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { Context } from "effect";
import { z } from "zod";

const VariablesEnvironmentSchema = z.object({
  BETTER_AUTH_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production"]), // Repeat of `drizzle.config.ts`
  POLAR_SUCCESS_URL: z.string().url(),
});

type VariablesEnvironment = z.infer<typeof VariablesEnvironmentSchema>;

const SecretsEnvironmentSchema = z.object({
  BETTER_AUTH_SECRET: z.string().nonempty(),
  BUNNY_TOKEN_API_KEY: z.string().nonempty(),
  CLOUDFLARE_ACCOUNT_ID: z.string().nonempty(),
  CLOUDFLARE_D1_TOKEN: z.string().nonempty(),
  CLOUDFLARE_DATABASE_ID: z.string().nonempty(),
  POLAR_ACCESS_TOKEN: z.string().nonempty(),
  RESEND_API_KEY: z.string().nonempty(),
});

type SecretsEnvironment = z.infer<typeof SecretsEnvironmentSchema>;

export interface FailedEnvironmentValidation {
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

interface Environment {
  variables: VariablesEnvironment;
  secrets: SecretsEnvironment;
}

export const environment: Environment = {
  variables: process.env as VariablesEnvironment,
  secrets: process.env as SecretsEnvironment,
};

export class EnvironmentService extends Context.Tag("EnvironmentService")<
  EnvironmentService,
  Environment
>() {}
