import { validateScenarios } from "@/lib/validation/scenarios";
import { validateGoldenDemo } from "@/lib/validation/golden-demo";
import { validateQueryInvalidation } from "@/lib/validation/query-cache";
import { validateHttpTransport } from "@/lib/validation/http-transport";

export async function validateApiWorkflows(): Promise<void> {
  await validateScenarios();
  await validateGoldenDemo();
  await validateQueryInvalidation();
  await validateHttpTransport();
}
