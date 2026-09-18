"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  PlayCircle,
} from "lucide-react";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { PageContainer } from "@/components/shared/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCourse } from "@/features/courses/queries";
import { useLearningPlan } from "@/features/learning-plans/queries";
import {
  taskStatusLabels,
  taskTypeLabels,
} from "@/features/learning-plans/presentation";
import { t } from "@/i18n";
import type { TaskStatus } from "@/types/learning-plan";

const statusIcon: Record<TaskStatus, typeof Circle> = {
  NOT_STARTED: Circle,
  IN_PROGRESS: PlayCircle,
  COMPLETED: CheckCircle2,
};

function isAvailableTarget(target: string): boolean {
  return (
    target.startsWith("/student/assessments/") ||
    target.startsWith("/student/mastery/") ||
    target.startsWith("/student/learning-plan/") ||
    target.startsWith("/student/opportunities")
  );
}

export function LearningPlanView({ courseId }: { courseId: string }) {
  const plan = useLearningPlan(courseId);
  const course = useCourse(courseId, "STUDENT");
  if (plan.isLoading || course.isLoading)
    return (
      <PageContainer className="py-8">
        <LoadingState cards={4} />
      </PageContainer>
    );
  if (plan.isError || course.isError)
    return (
      <PageContainer className="py-8">
        <ErrorState
          retry={() => {
            void plan.refetch();
            void course.refetch();
          }}
          title="courseNotFound"
        />
      </PageContainer>
    );
  if (!plan.data?.tasks.length || !course.data)
    return (
      <PageContainer className="py-8">
        <EmptyState />
      </PageContainer>
    );
  const outcomes = new Map(
    course.data.outcomes.map((item) => [item.id, item.title]),
  );
  return (
    <PageContainer className="py-8 sm:py-10">
      <header className="mb-7">
        <p className="text-sm font-medium text-primary">{t("learningPlan")}</p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
          {course.data.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {t("studentDashboardDescription")}
        </p>
      </header>
      <ol className="space-y-4">
        {[...plan.data.tasks]
          .sort((a, b) => a.order - b.order)
          .map((task) => {
            const Icon = statusIcon[task.status];
            const available = isAvailableTarget(task.actionTarget);
            return (
              <li className="relative pl-0 sm:pl-12" key={task.id}>
                <div
                  aria-hidden="true"
                  className="absolute left-0 top-5 hidden size-8 items-center justify-center rounded-full border border-primary bg-background text-sm font-semibold text-primary sm:flex"
                >
                  {task.order}
                </div>
                <Card>
                  <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <Badge variant="outline">
                            {t(taskTypeLabels[task.type])}
                          </Badge>
                          <Badge variant="secondary">
                            <Icon aria-hidden="true" />
                            {t(taskStatusLabels[task.status])}
                          </Badge>
                        </div>
                        <CardTitle>{task.title}</CardTitle>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock aria-hidden="true" className="size-4" />
                        {task.estimatedMinutes}{" "}
                        {t("estimatedMinutes").toLocaleLowerCase("uz")}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        {t("taskReason")}
                      </p>
                      <p className="mt-1 text-sm leading-6">{task.reason}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        {t("linkedOutcome")}
                      </p>
                      <p className="mt-1 text-sm leading-6">
                        {outcomes.get(task.outcomeId) ?? "—"}
                      </p>
                    </div>
                    <div className="self-end">
                      {available ? (
                        <Button asChild size="sm">
                          <Link href={task.actionTarget}>
                            {t("openTask")}
                            <ArrowRight aria-hidden="true" />
                          </Link>
                        </Button>
                      ) : (
                        <p className="max-w-48 text-xs text-muted-foreground">
                          {t("taskUnavailable")}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
      </ol>
    </PageContainer>
  );
}
