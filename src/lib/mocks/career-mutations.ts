import {
  careerProfileInputSchema,
  recommendationInputSchema,
} from "@/features/opportunities/contracts";
import {
  endorsementDecisionSchema,
  endorsementInputSchema,
} from "@/features/referrals/contracts";
import { ApiError } from "@/lib/api/errors";
import type { TransportRequest } from "@/lib/api/transport";
import { nextMutation, type MockDatabase } from "@/lib/mocks/database";
import {
  getProfile,
  getRecommendations,
  getStudentEvidence,
  required,
} from "@/lib/mocks/read-models";
import { validateInput } from "@/lib/mocks/validation";
import type { EndorsementRequest } from "@/types/endorsement";

export function careerMutation(
  db: MockDatabase,
  request: TransportRequest,
  studentId: string,
  professorId: string,
): unknown {
  const { endpoint, body } = request;
  switch (endpoint.name) {
    case "careerProfile": {
      const input = validateInput(careerProfileInputSchema, body);
      const profile = required(
        db.profiles,
        (item) => item.studentId === studentId,
      );
      Object.assign(profile, input);
      nextMutation(db);
      return { data: getProfile(db, studentId) };
    }
    case "updateRecommendation": {
      const recommendation = required(
        getRecommendations(db, studentId),
        (item) => item.id === endpoint.params.recommendationId,
      );
      const { status } = validateInput(recommendationInputSchema, body);
      db.recommendationStatuses[recommendation.id] = status;
      nextMutation(db);
      return { data: { ...recommendation, status } };
    }
    case "requestEndorsement": {
      const input = validateInput(endorsementInputSchema, body);
      required(db.professors, (item) => item.id === input.professorId);
      if (input.opportunityId)
        required(db.opportunities, (item) => item.id === input.opportunityId);
      if (!input.consentToReview)
        throw new ApiError("FORBIDDEN", 403, "apiForbidden");
      const existing = db.endorsements.find(
        (item) =>
          item.studentId === studentId &&
          item.professorId === input.professorId &&
          item.targetRole === input.targetRole &&
          item.status === "REQUESTED",
      );
      const profile = required(
        db.profiles,
        (item) => item.studentId === studentId,
      );
      profile.consent.professorEvidenceReview = true;
      if (existing) return { data: existing };
      const mutation = nextMutation(db);
      const endorsement: EndorsementRequest = {
        id: `endorsement-request-${mutation.revision}`,
        studentId,
        professorId: input.professorId,
        opportunityId: input.opportunityId ?? null,
        targetRole: input.targetRole,
        consentToReview: true,
        status: "REQUESTED",
        professorFeedback: null,
        requestedAt: mutation.recordedAt,
        history: [{ status: "REQUESTED", recordedAt: mutation.recordedAt }],
      };
      db.endorsements.push(endorsement);
      return { data: endorsement };
    }
    case "decideEndorsement": {
      const input = validateInput(endorsementDecisionSchema, body);
      const endorsement = required(
        db.endorsements,
        (item) =>
          item.id === input.requestId && item.professorId === professorId,
      );
      getStudentEvidence(db, endorsement.studentId, professorId);
      if (endorsement.status !== "REQUESTED")
        throw new ApiError("VALIDATION_ERROR", 422, "apiValidationError");
      endorsement.status = input.status;
      endorsement.professorFeedback = input.feedback ?? null;
      endorsement.history.push({
        status: input.status,
        recordedAt: nextMutation(db).recordedAt,
      });
      return { data: endorsement };
    }
    default:
      throw new ApiError("NOT_FOUND", 404, "apiNotFound");
  }
}
