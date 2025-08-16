import { useQueryClient } from "@tanstack/react-query";
import {
  type EnvironmentValidation,
  environmentValidationQueryOptions,
} from "@/utils/environment";

export const useEnvironmentValidation = (): Return => {
  const queryClient = useQueryClient();
  const environmentValidation = queryClient.getQueryData(
    environmentValidationQueryOptions.queryKey,
  );
  return { environmentValidation };
};

interface State {
  environmentValidation: EnvironmentValidation | undefined;
}
interface Actions {}

interface Return extends State, Actions {}
