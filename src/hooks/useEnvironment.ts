import { useQueryClient } from "@tanstack/react-query";
import {
  type EnvironmentValidation,
  environmentValidationQueryOptions,
} from "@/lib/environment";

export const useEnvironmentValidation = (): Return => {
  const queryClient = useQueryClient();
  const environmentValidation = queryClient.getQueryData(
    environmentValidationQueryOptions.queryKey,
  );

  return { environmentValidation };
};

interface Return {
  environmentValidation: EnvironmentValidation | undefined;
}
