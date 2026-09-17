import type { Assessment } from "@/types/assessment";
import type { CourseDetail, CourseSummary } from "@/types/course";
import type { UserRole } from "@/features/auth/types";

export function courseSummaryDto(course: CourseSummary) {
  return {
    course_id: course.id,
    title: course.title,
    code: course.code,
    professor_id: course.professorId,
    student_count: course.studentCount,
    outcome_count: course.outcomeCount,
  };
}
export function courseDetailDto(
  course: CourseDetail,
  role: UserRole,
  studentId: string,
) {
  return {
    ...courseSummaryDto(course),
    description: course.description,
    teacher: course.professor,
    learners:
      role === "PROFESSOR"
        ? course.students
        : course.students.filter((item) => item.id === studentId),
    enrollments:
      role === "PROFESSOR"
        ? course.enrollments
        : course.enrollments.filter((item) => item.studentId === studentId),
    outcomes: course.outcomes,
    materials: course.materials,
    assessments: course.assessments,
    latest_feedback: course.latestFeedback,
  };
}
export function assessmentDto(assessment: Assessment) {
  return {
    assessment_id: assessment.id,
    course_id: assessment.courseId,
    assessment_type: assessment.type,
    title: assessment.title,
    estimated_minutes: assessment.estimatedMinutes,
    questions: assessment.questions.map((question) => ({
      id: question.id,
      outcomeId: question.outcomeId,
      type: question.type,
      prompt: question.prompt,
      options: question.options.map(({ id, text }) => ({ id, text })),
    })),
  };
}
