import { useState } from "react";
import type { z } from "zod";

type Values = Record<string, string>;

// Validates on every change. A field's first error is only exposed once the
// field has content, so an untouched form doesn't start out red.
export function useZodForm<T extends Values, Output>(schema: z.ZodType<Output, T>, initialValues: T) {
  const [values, setValues] = useState(initialValues);
  const result = schema.safeParse(values);

  const errors: Partial<Record<keyof T, string>> = {};
  if (!result.success) {
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof T;
      if (!(key in errors) && values[key] !== "") errors[key] = issue.message;
    }
  }

  function setValue(key: keyof T, value: string) {
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  return {
    values,
    setValue,
    errors,
    isValid: result.success,
    data: result.success ? result.data : undefined,
  };
}
