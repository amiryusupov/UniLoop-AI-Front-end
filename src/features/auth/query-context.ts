"use client";

import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store";
import { getDemoUser } from "@/features/auth/demo-users";
import type { UserRole } from "@/features/auth/types";
import { ApiError } from "@/lib/api/errors";
import { invalidateQueryKeys } from "@/lib/api/query-keys";

export function useQueryContext(expectedRole: UserRole) {
  const role = useAuthStore((state) => state.role);
  const hydrated = useAuthStore((state) => state.hydrated);
  return {
    userId: role ? getDemoUser(role).id : "anonymous",
    enabled: hydrated && role === expectedRole,
  };
}
export function useRoleMutation<TData, TVariables>(
  expectedRole: UserRole,
  mutate: (variables: TVariables) => Promise<TData>,
  affectedKeys: (
    data: TData,
    variables: TVariables,
    userId: string,
  ) => readonly QueryKey[],
) {
  const queryClient = useQueryClient();
  return useMutation<TData, ApiError, TVariables, { userId: string }>({
    onMutate: () => {
      const state = useAuthStore.getState();
      if (!state.hydrated || !state.role)
        throw new ApiError("UNAUTHORIZED", 401, "apiUnauthorized");
      if (state.role !== expectedRole)
        throw new ApiError("FORBIDDEN", 403, "apiForbidden");
      return { userId: getDemoUser(state.role).id };
    },
    mutationFn: mutate,
    onSuccess: async (data, variables, context) => {
      if (context)
        await invalidateQueryKeys(
          queryClient,
          affectedKeys(data, variables, context.userId),
        );
    },
  });
}
