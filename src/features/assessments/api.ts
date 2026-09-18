import {
  adaptAssessment,
  adaptSubmission,
} from "@/features/assessments/adapters";
import {
  assessmentResponseSchema,
  submissionResponseSchema,
} from "@/features/assessments/contracts";
import { getApiClient, type ApiClient } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { SubmissionRequest } from "@/types/assessment";
import type { UserRole } from "@/features/auth/types";
export function getAssessment(
  assessmentId: string,
  signal?: AbortSignal,
  client: ApiClient = getApiClient(),
  role: UserRole = "STUDENT",
) {
  return client.request(
    { endpoint: endpoints.assessment(assessmentId, role), role, signal },
    assessmentResponseSchema,
    (dto) => adaptAssessment(dto.data),
  );
}
export function submitAssessment(
  assessmentId: string,
  input: SubmissionRequest,
  client: ApiClient = getApiClient(),
) {
  return client.request(
    {
      endpoint: endpoints.submitAssessment(assessmentId),
      role: "STUDENT",
      body: {
        answers: input.answers.map(({ text, ...answer }) => ({
          ...answer,
          ...(text !== undefined ? { answer: text } : {}),
        })),
      },
    },
    submissionResponseSchema,
    adaptSubmission,
  );
}
