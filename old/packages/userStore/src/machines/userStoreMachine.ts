import { type QueryClient, queryOptions } from "@tanstack/react-query"
import { Schema } from "effect"
import { getUserStoreFn, setProgressFn } from "../logic/userStoreLogic"
import { UserStore } from "../types/UserStore"
import type { SetUserStoreParams } from "../types/UserStoreParams"

export const userStoreQueryOptions = queryOptions({
  queryKey: ["userStore"],
  queryFn: () => getUserStoreFn(),
  select: Schema.decodeSync(UserStore),
})

export const setProgressMutationOptions = (queryClient: QueryClient) => ({
  mutationKey: ["setProgress"],
  mutationFn: async (params: SetUserStoreParams) =>
    setProgressFn({ data: params }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: userStoreQueryOptions.queryKey })
  },
})
