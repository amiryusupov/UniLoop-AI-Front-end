import { adaptLearningPlan } from "@/features/learning-plans/adapters";
import { learningPlanResponseSchema } from "@/features/learning-plans/contracts";
import { getApiClient, type ApiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
export function getLearningPlan(
  courseId: string,
  signal?: AbortSignal,
  client: ApiClient = getApiClient(),
) {
  return client.request(
    { endpoint: endpoints.learningPlan(courseId), role: "STUDENT", signal },
    learningPlanResponseSchema,
    adaptLearningPlan,
  );
}
export function generateLearningPlan(
  courseId: string,
  client: ApiClient = getApiClient(),
) {
  return client.request(
    { endpoint: endpoints.generateLearningPlan(courseId), role: "STUDENT" },
    learningPlanResponseSchema,
    adaptLearningPlan,
  );
}
