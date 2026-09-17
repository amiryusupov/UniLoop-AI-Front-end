"use client";

import { useQuery } from "@tanstack/react-query";
import { getDemoUser } from "@/features/auth/demo-users";
import {
  useQueryContext,
  useRoleMutation,
} from "@/features/auth/query-context";
import {
  getOpportunityDashboard,
  getRecommendations,
  requestEndorsement,
  updateCareerProfile,
  updateRecommendation,
} from "@/features/opportunities/api";
import { queryKeys } from "@/lib/api/query-keys";
import type {
  CareerProfileUpdate,
  RecommendationUpdate,
} from "@/types/opportunity";
import type { EndorsementRequestInput } from "@/types/endorsement";

export function useOpportunityDashboard() {
  const context = useQueryContext("STUDENT");
  return useQuery({
    queryKey: queryKeys.opportunities.dashboard(context.userId),
    queryFn: ({ signal }) => getOpportunityDashboard(signal),
    enabled: context.enabled,
  });
}
export function useRecommendations() {
  const context = useQueryContext("STUDENT");
  return useQuery({
    queryKey: queryKeys.opportunities.recommendations(context.userId),
    queryFn: ({ signal }) => getRecommendations(signal),
    enabled: context.enabled,
  });
}
export function useUpdateCareerProfile() {
  return useRoleMutation(
    "STUDENT",
    (input: CareerProfileUpdate) => updateCareerProfile(input),
    (_data, _input, userId) => [
      queryKeys.opportunities.dashboard(userId),
      queryKeys.opportunities.recommendations(userId),
      queryKeys.referrals.candidates(getDemoUser("PROFESSOR").id),
      queryKeys.referrals.evidence(getDemoUser("PROFESSOR").id, userId),
    ],
  );
}
export function useUpdateRecommendation() {
  return useRoleMutation(
    "STUDENT",
    (input: RecommendationUpdate & { recommendationId: string }) =>
      updateRecommendation(input.recommendationId, { status: input.status }),
    (_data, _input, userId) => [
      queryKeys.opportunities.recommendations(userId),
      queryKeys.opportunities.dashboard(userId),
    ],
  );
}
export function useRequestEndorsement() {
  return useRoleMutation(
    "STUDENT",
    (input: EndorsementRequestInput) => requestEndorsement(input),
    (data, _input, userId) => [
      queryKeys.opportunities.dashboard(userId),
      queryKeys.referrals.candidates(data.professorId),
      queryKeys.referrals.evidence(data.professorId, userId),
    ],
  );
}
