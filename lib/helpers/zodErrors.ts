import { ZodError } from "zod";

/**
 * Maps Zod validation errors to a field-error record for form display
 */
export function mapZodErrors<T extends Record<string, unknown>>(
  error: ZodError
): Partial<Record<keyof T, string>> {
  const fieldErrors: Partial<Record<keyof T, string>> = {};

  error.issues.forEach((issue) => {
    const field = issue.path[0] as keyof T;
    if (!fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  });

  return fieldErrors;
}
