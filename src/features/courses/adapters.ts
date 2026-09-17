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
    id: dto.course_id,
    title: dto.title,
    code: dto.code,
    professorId: dto.professor_id,
    studentCount: dto.student_count,
    outcomeCount: dto.outcome_count,
  };
}
export function adaptCourseDetail(
  dto: z.output<typeof courseDetailDtoSchema>,
): CourseDetail {
  return {
    ...adaptCourseSummary(dto),
    description: dto.description,
    professor: dto.teacher,
    students: dto.learners,
    enrollments: dto.enrollments,
    outcomes: dto.outcomes,
    materials: dto.materials,
    assessments: dto.assessments,
    latestFeedback: dto.latest_feedback,
  };
}
export function adaptDashboard(
  dto: z.output<typeof dashboardResponseSchema>,
): AcademicDashboard {
  return dto.data;
}
