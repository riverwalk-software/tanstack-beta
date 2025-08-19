import {
  type UseNavigateResult,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { createAtom } from "@xstate/store";
import { useAtom } from "@xstate/store/react";

const isNavigatingAtom = createAtom(false);

export const useNavigation = (): Return => {
  const _isNavigating = useAtom(isNavigatingAtom);
  const routerPending = useRouterState({
    select: ({ isLoading, isTransitioning, status }) =>
      isLoading || isTransitioning || status === "pending",
  });
  const navigate = useNavigate();
  const state = {
    isNavigating: _isNavigating || routerPending,
  } satisfies State;
  const mutations = {
    navigate,
    toggleIsNavigating: () => isNavigatingAtom.set((prev) => !prev),
  } satisfies Mutations;
  return { ...state, ...mutations };
};

interface State {
  isNavigating: boolean;
}
interface Mutations {
  toggleIsNavigating: () => void;
  navigate: UseNavigateResult<string>;
}
interface Return extends State, Mutations {}
