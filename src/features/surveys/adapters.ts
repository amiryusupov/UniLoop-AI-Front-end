import { z } from "zod";
import { surveysResponseSchema } from "@/features/surveys/contracts";
import type { Survey } from "@/types/survey";
export function adaptSurveys(
  dto: z.output<typeof surveysResponseSchema>,
): Survey[] {
  return dto.data;
}
