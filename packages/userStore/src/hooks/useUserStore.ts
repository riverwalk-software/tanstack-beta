import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { useCallback } from "react"
import { _getIsComplete, _getProgress } from "../logic/userStoreLogic"
import {
  setProgressMutationOptions,
  userStoreQueryOptions,
} from "../machines/userStoreMachine"
import type { ProgressData } from "../types/ProgressData"
import type { UserStore, UserStoreSlugs } from "../types/UserStore"
import type {
  GetUserStoreParams,
  SetUserStoreParams,
} from "../types/UserStoreParams"

/**
 * React hook to access and update the user's progress store.
 *
 * Provides the current user store, helpers to check completion and progress,
 * and a mutation object for updating progress.
 *
 * @returns {Object} An object containing:
 *   - userStore: The current user store data.
 *   - getIsComplete: Function to check if a chapter/lecture is complete.
 *   - getProgress: Function to get progress data for a given scope.
 *   - setProgressMt: Mutation object for updating progress.
 *
 * @example
 * const { userStore, getIsComplete, getProgress, setProgressMt } = useUserStore();
 * const isComplete = getIsComplete({ schoolSlug, courseSlug, chapterSlug, lectureSlug });
 * const progress = getProgress({ type: "COURSE", schoolSlug, courseSlug });
 * setProgressMt.mutate({ schoolSlug, courseSlug, chapterSlug, lectureSlug, isComplete: true });
 */
export const useUserStore = (): {
  userStore: UserStore
  getIsComplete: (params: UserStoreSlugs) => boolean
  getProgress: (params: GetUserStoreParams) => ProgressData
  setProgressMt: UseMutationResult<void, Error, SetUserStoreParams, unknown>
} => {
  const { data: userStore } = useSuspenseQuery(userStoreQueryOptions)
  const getIsComplete = useCallback(
    (slugs: UserStoreSlugs) => _getIsComplete(slugs)(userStore),
    [userStore],
  )
  const getProgress = useCallback(
    (params: GetUserStoreParams) => _getProgress(params)(userStore),
    [userStore],
  )
  const queryClient = useQueryClient()
  const setProgressMt = useMutation(setProgressMutationOptions(queryClient))
  return { userStore, getIsComplete, getProgress, setProgressMt }
}
