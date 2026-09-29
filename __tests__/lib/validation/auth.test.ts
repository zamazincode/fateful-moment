import {
  emailSchema,
  nameSchema,
  passwordRules,
  passwordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/validation/auth";

function messages(result: { success: boolean; error?: { issues: { message: string }[] } }) {
  return result.error?.issues.map((issue) => issue.message) ?? [];
}

describe("nameSchema", () => {
  it("needs at least 3 non-space characters", () => {
    expect(messages(nameSchema.safeParse("J D"))).toEqual(["Enter at least 3 characters."]);
    expect(nameSchema.safeParse("John Doe").success).toBe(true);
  });

  it("trims the name", () => {
    expect(nameSchema.parse("  John  ")).toBe("John");
  });
});

describe("emailSchema", () => {
  it("rejects an address without @", () => {
    expect(messages(emailSchema.safeParse("johndoeQmail.com"))).toEqual(["Please enter a valid email address."]);
  });

  it("accepts and trims a valid address", () => {
    expect(emailSchema.parse(" johndoe@mail.com ")).toBe("johndoe@mail.com");
  });
});

describe("passwordSchema", () => {
  it.each([
    ["short", "Ab1", "Must be at least 8 characters long"],
    ["no uppercase", "abcdefg1", "Must contain at least 1 uppercase letter"],
    ["no lowercase", "ABCDEFG1", "Must contain at least 1 lowercase letter"],
    ["no digit", "Abcdefgh", "Must contain at least 1 digit"],
  ])("reports a %s password", (_, password, message) => {
    expect(messages(passwordSchema.safeParse(password))).toContain(message);
  });

  it("reports every failing rule at once", () => {
    expect(messages(passwordSchema.safeParse(""))).toHaveLength(passwordRules.length);
  });

  it("accepts a password that meets every rule", () => {
    expect(passwordSchema.safeParse("Johndoe1").success).toBe(true);
  });
});

describe("passwordRules", () => {
  it("matches the ss state for Johd: case rules met, length and digit not", () => {
    const met = Object.fromEntries(passwordRules.map((rule) => [rule.id, rule.test("Johd")]));
    expect(met).toEqual({ length: false, uppercase: true, lowercase: true, digit: false });
  });
});

describe("form schemas", () => {
  it("validates a complete sign up", () => {
    expect(signUpSchema.safeParse({ name: "John Doe", email: "johndoe@mail.com", password: "Johndoe1" }).success).toBe(
      true,
    );
  });

  it("only needs a non-empty password to sign in", () => {
    expect(signInSchema.safeParse({ email: "johndoe@mail.com", password: "x" }).success).toBe(true);
    expect(signInSchema.safeParse({ email: "johndoe@mail.com", password: "" }).success).toBe(false);
  });

  it("only needs a valid email to request a reset", () => {
    expect(resetPasswordSchema.safeParse({ email: "johndoe@mail.com" }).success).toBe(true);
    expect(resetPasswordSchema.safeParse({ email: "johndoe" }).success).toBe(false);
  });
});
