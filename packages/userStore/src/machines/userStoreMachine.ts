import { type QueryClient, queryOptions } from "@tanstack/react-query"
import { getUserStoreFn, setProgressFn } from "../logic/userStoreLogic"
import type { SetUserStoreParams } from "../types/UserStoreParams"

export const userStoreQueryOptions = queryOptions({
  queryKey: ["userStore"],
  queryFn: () => getUserStoreFn(),
})

export const setProgressMutationOptions = (queryClient: QueryClient) => ({
  mutationKey: ["setProgress"],
  mutationFn: async (params: SetUserStoreParams) =>
    setProgressFn({ data: params }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: userStoreQueryOptions.queryKey })
  },
})
