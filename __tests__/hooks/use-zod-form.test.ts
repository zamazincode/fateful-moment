import { act, renderHook } from "@testing-library/react-native";

import { useZodForm } from "@/hooks/use-zod-form";
import { signUpSchema } from "@/lib/validation/auth";

const empty = { name: "", email: "", password: "" };

describe("useZodForm", () => {
  it("hides errors for untouched empty fields", async () => {
    const { result } = await renderHook(() => useZodForm(signUpSchema, empty));

    expect(result.current.errors).toEqual({});
    expect(result.current.isValid).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it("shows the first error of a field once it has content", async () => {
    const { result } = await renderHook(() => useZodForm(signUpSchema, empty));

    await act(() => result.current.setValue("name", "J D"));
    await act(() => result.current.setValue("password", "a"));

    expect(result.current.errors).toEqual({
      name: "Enter at least 3 characters.",
      password: "Must be at least 8 characters long",
    });
  });

  it("exposes parsed data when the form is valid", async () => {
    const { result } = await renderHook(() => useZodForm(signUpSchema, empty));

    await act(() => result.current.setValue("name", " John Doe "));
    await act(() => result.current.setValue("email", "johndoe@mail.com"));
    await act(() => result.current.setValue("password", "Johndoe1"));

    expect(result.current.isValid).toBe(true);
    expect(result.current.data).toEqual({ name: "John Doe", email: "johndoe@mail.com", password: "Johndoe1" });
  });
});
