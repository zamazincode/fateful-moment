import { render, screen, userEvent } from "@testing-library/react-native";
import { router } from "expo-router";

import ForgotPassword from "@/app/(auth)/forgot-password";

jest.mock("expo-router", () => ({
  router: { push: jest.fn(), back: jest.fn(), replace: jest.fn(), canGoBack: jest.fn(() => true) },
}));

beforeEach(() => jest.clearAllMocks());

describe("Forgot password screen", () => {
  it("shows the heading and a disabled send button", async () => {
    await render(<ForgotPassword />);

    expect(screen.getByRole("header", { name: "Reset your password" })).toBeOnTheScreen();
    expect(screen.getByText("Enter your email to receive a reset link")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Send Reset Link" })).toBeDisabled();
  });

  it("flags an invalid email and keeps the button disabled", async () => {
    const user = userEvent.setup();
    await render(<ForgotPassword />);

    await user.type(screen.getByLabelText("Your email address"), "johndoeQmail.com");

    expect(screen.getByText("Please enter a valid email address.")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Send Reset Link" })).toBeDisabled();
  });

  it("opens the confirmation with the trimmed email", async () => {
    const user = userEvent.setup();
    await render(<ForgotPassword />);

    await user.type(screen.getByLabelText("Your email address"), " johndoe@mail.com ");
    await user.press(screen.getByRole("button", { name: "Send Reset Link" }));

    expect(router.push).toHaveBeenCalledWith({ pathname: "/check-email", params: { email: "johndoe@mail.com" } });
  });
});
