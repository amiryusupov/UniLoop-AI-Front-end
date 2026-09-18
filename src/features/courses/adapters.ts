import { z } from "zod";
import {
  courseDetailDtoSchema,
  courseSummaryDtoSchema,
  dashboardResponseSchema,
} from "@/features/courses/contracts";
import type {
  AcademicDashboard,
  CourseDetail,
  CourseSummary,
} from "@/types/course";

export function adaptCourseSummary(
  dto: z.output<typeof courseSummaryDtoSchema>,
): CourseSummary {
  return {
    id: dto.id,
    title: dto.title,
    code: dto.code,
    professorId: dto.professorId,
    studentCount: dto.studentCount,
    outcomeCount: dto.outcomeCount,
  };
}
export function adaptCourseDetail(
  dto: z.output<typeof courseDetailDtoSchema>,
): CourseDetail {
  return {
    ...adaptCourseSummary(dto),
    description: dto.description,
    professor: dto.professor,
    students: dto.students,
    enrollments: dto.enrollments,
    outcomes: dto.outcomes,
    materials: dto.materials,
    assessments: dto.assessments,
    latestFeedback: dto.latestFeedback,
  };
}
export function adaptDashboard(
  dto: z.output<typeof dashboardResponseSchema>,
): AcademicDashboard {
  return dto.data;
}
