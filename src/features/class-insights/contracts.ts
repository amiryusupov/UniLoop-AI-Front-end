import { z } from "zod";
import { dtoEnvelope, idSchema, percentageSchema } from "@/lib/api/schemas";
export const insightSchema = z.object({
  courseId: idSchema,
  professorId: idSchema,
  studentCount: z.number().int().nonnegative(),
  outcomes: z.array(
    z.object({
      outcomeId: idSchema,
      diagnosticPercentage: percentageSchema,
      followUpPercentage: percentageSchema.nullable(),
      improvement: z.number().min(-100).max(100).nullable(),
      followUpStudentCount: z.number().int().nonnegative(),
      supportStudentIds: z.array(idSchema),
    }),
  ),
  misconceptions: z.array(
    z.object({ misconceptionId: idSchema, studentIds: z.array(idSchema) }),
  ),
  questionDifficulty: z.array(
    z.object({
      questionId: idSchema,
      assessmentId: idSchema,
      correctCount: z.number().int().nonnegative(),
      responseCount: z.number().int().nonnegative(),
      difficultyPercentage: percentageSchema,
    }),
  ),
  supportGroups: z.array(
    z.object({
      id: idSchema,
      outcomeId: idSchema,
      studentIds: z.array(idSchema),
      reason: z.string(),
    }),
  ),
  evidenceAssessmentIds: z.array(idSchema),
  explanation: z.string(),
});
export const insightResponseSchema = dtoEnvelope(insightSchema);
