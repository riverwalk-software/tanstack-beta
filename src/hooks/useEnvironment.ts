import { useQueryClient } from "@tanstack/react-query";
import {
  type EnvironmentValidation,
  environmentValidationQueryOptions,
} from "@/utils/environment";

export const useEnvironmentValidation = (): Return => {
  const queryClient = useQueryClient();
  const state = {
    environmentValidation: queryClient.getQueryData(
      environmentValidationQueryOptions.queryKey,
    ),
  } satisfies State;

  const mutations = {} satisfies Mutations;
  return { ...state, ...mutations };
};

interface State {
  environmentValidation: EnvironmentValidation | undefined;
}
interface Mutations {}

interface Return extends State, Mutations {}
