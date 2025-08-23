import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useCallback } from "react";
import { _getIsComplete, _getProgress } from "../logic/userStoreLogic";
import {
  setProgressMutationOptions,
  userStoreQueryOptions,
} from "../machines/userStoreMachine";
import type { ProgressData } from "../types/ProgressData";
import type { UserStore, UserStoreIds } from "../types/UserStore";
import type {
  GetUserStoreParams,
  SetUserStoreParams,
} from "../types/UserStoreParams";

export const useUserStore = (): {
  userStore: UserStore;
  getIsComplete: (params: UserStoreIds) => boolean;
  getProgress: (params: GetUserStoreParams) => ProgressData;
  setProgressMt: UseMutationResult<void, Error, SetUserStoreParams, unknown>;
} => {
  const { data: userStore } = useSuspenseQuery(userStoreQueryOptions);
  const getIsComplete = useCallback(
    (ids: UserStoreIds) => _getIsComplete(ids)(userStore),
    [userStore],
  );
  const getProgress = useCallback(
    (params: GetUserStoreParams) => _getProgress(params)(userStore),
    [userStore],
  );
  const queryClient = useQueryClient();
  const setProgressMt = useMutation(setProgressMutationOptions(queryClient));
  return { userStore, getIsComplete, getProgress, setProgressMt };
};
