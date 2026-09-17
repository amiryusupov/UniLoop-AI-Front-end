import { z } from "zod";
import {
  dtoEnvelope,
  idSchema,
  nextActionSchema,
  professorSchema,
  studentSchema,
  timestampSchema,
} from "@/lib/api/schemas";
export const outcomeSchema = z.object({
  id: idSchema,
  courseId: idSchema,
  title: z.string(),
  description: z.string(),
});
export const materialSchema = z.object({
  id: idSchema,
  courseId: idSchema,
  title: z.string(),
  content: z.string(),
  uploadedAt: timestampSchema,
});
export const courseSummaryDtoSchema = z.object({
  course_id: idSchema,
  title: z.string(),
  code: z.string(),
  professor_id: idSchema,
  student_count: z.number().int().nonnegative(),
  outcome_count: z.number().int().nonnegative(),
});
export const courseDetailDtoSchema = courseSummaryDtoSchema.extend({
  description: z.string(),
  teacher: professorSchema,
  learners: z.array(studentSchema),
  enrollments: z.array(
    z.object({
      studentId: idSchema,
      courseId: idSchema,
      enrolledAt: timestampSchema,
    }),
  ),
  outcomes: z.array(outcomeSchema),
  materials: z.array(materialSchema),
  assessments: z.array(
    z.object({
      id: idSchema,
      courseId: idSchema,
      title: z.string(),
      type: z.enum(["DIAGNOSTIC", "FOLLOW_UP"]),
      questionCount: z.number().int().nonnegative(),
    }),
  ),
  latest_feedback: z.string().nullable(),
});
export const dashboardSchema = z.object({
  userId: idSchema,
  courseIds: z.array(idSchema),
  nextAction: nextActionSchema.nullable(),
  feedback: z.string().nullable(),
});
export const courseListResponseSchema = dtoEnvelope(
  z.array(courseSummaryDtoSchema),
);
export const courseResponseSchema = dtoEnvelope(courseDetailDtoSchema);
export const dashboardResponseSchema = dtoEnvelope(dashboardSchema);
export const materialInputSchema = z
  .object({
    title: z.string().trim().min(1).max(200),
    content: z.string().trim().min(1).max(100_000),
  })
  .strict();
export const generationInputSchema = z
  .object({ type: z.enum(["DIAGNOSTIC", "FOLLOW_UP"]) })
  .strict();
