import { render, screen, userEvent } from "@testing-library/react-native";
import { router } from "expo-router";

import Welcome from "@/app/(auth)/welcome";
import { useSession } from "@/store/session";

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));
jest.mock("@/store/session", () => ({ useSession: jest.fn() }));

const signInWithProvider = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(useSession).mockReturnValue({
    user: null,
    status: "ready",
    signIn: jest.fn(),
    signUp: jest.fn(),
    signInWithProvider,
    signOut: jest.fn(),
    changePassword: jest.fn(),
    deleteAccount: jest.fn(),
  });
});

describe("Welcome screen", () => {
  it("shows the heading, the sign in options and the legal notice", async () => {
    await render(<Welcome />);

    expect(screen.getByRole("header", { name: "Welcome to Fateful Moment" })).toBeOnTheScreen();
    expect(screen.getByText("Sign in to continue your journey")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Continue with Email" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Continue with Apple" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Continue with Google" })).toBeOnTheScreen();
    expect(screen.getByText("OR")).toBeOnTheScreen();
    expect(screen.getByText("Terms of Use")).toBeOnTheScreen();
    expect(screen.getByText("Privacy Policy")).toBeOnTheScreen();
  });

  it("opens the email sign in screen", async () => {
    const user = userEvent.setup();
    await render(<Welcome />);

    await user.press(screen.getByRole("button", { name: "Continue with Email" }));

    expect(router.push).toHaveBeenCalledWith("/sign-in");
    expect(signInWithProvider).not.toHaveBeenCalled();
  });

  it.each([
    ["Continue with Apple", "apple"],
    ["Continue with Google", "google"],
  ])("signs in through %s", async (name, provider) => {
    const user = userEvent.setup();
    await render(<Welcome />);

    await user.press(screen.getByRole("button", { name }));

    expect(signInWithProvider).toHaveBeenCalledWith(provider);
    expect(router.push).not.toHaveBeenCalled();
  });
});
