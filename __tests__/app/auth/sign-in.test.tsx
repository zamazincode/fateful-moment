import { render, screen, userEvent } from "@testing-library/react-native";
import { router } from "expo-router";

import SignIn from "@/app/(auth)/sign-in";
import { useSession } from "@/store/session";

jest.mock("expo-router", () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn(), canGoBack: jest.fn(() => true) },
}));
jest.mock("@/store/session", () => ({ useSession: jest.fn() }));

const signIn = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  signIn.mockResolvedValue({ ok: true, user: { name: "John Doe", email: "johndoe@mail.com" } });
  jest.mocked(useSession).mockReturnValue({
    user: null,
    status: "ready",
    signIn,
    signUp: jest.fn(),
    signInWithProvider: jest.fn(),
    signOut: jest.fn(),
  });
});

async function signInWith(email: string, password: string) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Your email address"), email);
  await user.type(screen.getByLabelText("Your password"), password);
  await user.press(screen.getByRole("button", { name: "Sign In" }));
}

describe("Sign in screen", () => {
  it("keeps the button disabled until the email is valid and a password is typed", async () => {
    const user = userEvent.setup();
    await render(<SignIn />);

    await user.type(screen.getByLabelText("Your email address"), "johndoeQmail.com");

    expect(screen.getByText("Please enter a valid email address.")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeDisabled();
  });

  it("signs in with the entered credentials", async () => {
    await render(<SignIn />);

    await signInWith("johndoe@mail.com", "Johndoe1");

    expect(signIn).toHaveBeenCalledWith("johndoe@mail.com", "Johndoe1");
  });

  it("shows the wrong password message", async () => {
    signIn.mockResolvedValue({ ok: false, reason: "wrong-password" });
    await render(<SignIn />);

    await signInWith("johndoe@mail.com", "Wrong123");

    expect(await screen.findByText("Your password is wrong. Please try again.")).toBeOnTheScreen();
  });

  it("shows a generic message for an unknown email", async () => {
    signIn.mockResolvedValue({ ok: false, reason: "unknown-email" });
    await render(<SignIn />);

    await signInWith("nobody@mail.com", "Johndoe1");

    expect(await screen.findByText("Email or password is wrong.")).toBeOnTheScreen();
  });

  it("clears the error when the password is edited", async () => {
    signIn.mockResolvedValue({ ok: false, reason: "wrong-password" });
    const user = userEvent.setup();
    await render(<SignIn />);
    await signInWith("johndoe@mail.com", "Wrong123");
    await screen.findByText("Your password is wrong. Please try again.");

    await user.type(screen.getByLabelText("Your password"), "4");

    expect(screen.queryByText("Your password is wrong. Please try again.")).not.toBeOnTheScreen();
  });

  it("opens the reset password flow", async () => {
    const user = userEvent.setup();
    await render(<SignIn />);

    await user.press(screen.getByRole("button", { name: "Forgot password?" }));

    expect(router.push).toHaveBeenCalledWith("/forgot-password");
  });

  it("switches to sign up from the footer", async () => {
    const user = userEvent.setup();
    await render(<SignIn />);

    await user.press(screen.getByRole("link", { name: "Sign up" }));

    expect(router.replace).toHaveBeenCalledWith("/sign-up");
  });
});
