import type { ProfessorSummary, StudentSummary } from "@/types/user";
import type { AssessmentType } from "@/types/assessment";

export interface LearningOutcome {
  id: string;
  courseId: string;
  title: string;
  description: string;
}
export interface CourseMaterial {
  id: string;
  courseId: string;
  title: string;
  content: string;
  uploadedAt: string;
}
export interface Enrollment {
  studentId: string;
  courseId: string;
  enrolledAt: string;
}
export interface AssessmentSummary {
  id: string;
  courseId: string;
  title: string;
  type: AssessmentType;
  questionCount: number;
  submissionCount?: number;
}
export interface CourseSummary {
  id: string;
  title: string;
  code: string;
  professorId: string;
  studentCount: number;
  outcomeCount: number;
}
export interface CourseDetail extends CourseSummary {
  description: string;
  professor: ProfessorSummary;
  students: StudentSummary[];
  enrollments: Enrollment[];
  outcomes: LearningOutcome[];
  materials: CourseMaterial[];
  assessments: AssessmentSummary[];
  latestFeedback: string | null;
}
export interface AcademicDashboard {
  userId: string;
  courseIds: string[];
  nextAction: { label: string; href: string } | null;
  feedback: string | null;
}
