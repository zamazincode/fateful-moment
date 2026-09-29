import { z } from "zod";

export type PasswordRule = {
  id: string;
  label: string;
  test: (value: string) => boolean;
};

// Single source for the password schema and the checklist under the field.
export const passwordRules: PasswordRule[] = [
  { id: "length", label: "Must be at least 8 characters long", test: (value) => value.length >= 8 },
  { id: "uppercase", label: "Must contain at least 1 uppercase letter", test: (value) => /[A-Z]/.test(value) },
  { id: "lowercase", label: "Must contain at least 1 lowercase letter", test: (value) => /[a-z]/.test(value) },
  { id: "digit", label: "Must contain at least 1 digit", test: (value) => /\d/.test(value) },
];

// Spaces don't count, so "J D" is still too short.
export const nameSchema = z
  .string()
  .trim()
  .refine((value) => value.replace(/\s/g, "").length >= 3, "Enter at least 3 characters.");

export const emailSchema = z
  .string()
  .trim()
  .pipe(z.email({ error: "Please enter a valid email address." }));

export const passwordSchema = z.string().superRefine((value, ctx) => {
  for (const rule of passwordRules) {
    if (!rule.test(value)) ctx.addIssue({ code: "custom", message: rule.label });
  }
});

export const signUpSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password."),
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
});

export type SignUpValues = z.infer<typeof signUpSchema>;
export type SignInValues = z.infer<typeof signInSchema>;

// Errors that come back from the account store rather than the schema.
export const authMessages = {
  emailTaken: "An account with this email already exists.",
  wrongPassword: "Your password is wrong. Please try again.",
  // Unknown emails get a generic message so the form doesn't reveal which
  // addresses have an account.
  invalidCredentials: "Email or password is wrong.",
} as const;
