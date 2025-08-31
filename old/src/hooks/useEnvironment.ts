import { useQueryClient } from "@tanstack/react-query"
import {
  type EnvironmentValidation,
  environmentValidationQueryOptions,
} from "@/lib/environment"

export const useEnvironmentValidation = (): {
  maybeEnvironmentValidation: MaybeEnvironmentValidation
} => {
  const queryClient = useQueryClient()
  const maybeEnvironmentValidation = queryClient.getQueryData(
    environmentValidationQueryOptions.queryKey,
  )

  return { maybeEnvironmentValidation }
}

type MaybeEnvironmentValidation = EnvironmentValidation | undefined
