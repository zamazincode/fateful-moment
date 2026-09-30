import { render, screen, userEvent } from "@testing-library/react-native";
import { router } from "expo-router";

import SignUp from "@/app/(auth)/sign-up";
import { useSession } from "@/store/session";

jest.mock("expo-router", () => ({ router: { replace: jest.fn(), back: jest.fn(), canGoBack: jest.fn(() => true) } }));
jest.mock("@/store/session", () => ({ useSession: jest.fn() }));

const signUp = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  signUp.mockResolvedValue({ ok: true, user: { name: "John Doe", email: "johndoe@mail.com" } });
  jest.mocked(useSession).mockReturnValue({
    user: null,
    status: "ready",
    signIn: jest.fn(),
    signUp,
    signInWithProvider: jest.fn(),
    signOut: jest.fn(),
    changePassword: jest.fn(),
    deleteAccount: jest.fn(),
  });
});

async function fill(user: ReturnType<typeof userEvent.setup>, values: { name?: string; email?: string; password?: string }) {
  if (values.name) await user.type(screen.getByLabelText("Full Name"), values.name);
  if (values.email) await user.type(screen.getByLabelText("Your email address"), values.email);
  if (values.password) await user.type(screen.getByLabelText("Your password"), values.password);
}

describe("Sign up screen", () => {
  it("starts with a disabled sign up button and no errors", async () => {
    await render(<SignUp />);

    expect(screen.getByRole("header", { name: "Create your Fateful Moment Account" })).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Sign up" })).toBeDisabled();
    expect(screen.queryByText("Enter at least 3 characters.")).not.toBeOnTheScreen();
  });

  it("shows the name and email errors from the design", async () => {
    const user = userEvent.setup();
    await render(<SignUp />);

    await fill(user, { name: "J D", email: "johndoeQmail.com" });

    expect(screen.getByText("Enter at least 3 characters.")).toBeOnTheScreen();
    expect(screen.getByText("Please enter a valid email address.")).toBeOnTheScreen();
  });

  it("shows the password checklist while typing a password", async () => {
    const user = userEvent.setup();
    await render(<SignUp />);

    await user.type(screen.getByLabelText("Your password"), "Johd", { skipBlur: true });

    expect(screen.getByLabelText("Must be at least 8 characters long, not met")).toBeOnTheScreen();
    expect(screen.getByLabelText("Must contain at least 1 uppercase letter, met")).toBeOnTheScreen();
    expect(screen.getByLabelText("Must contain at least 1 lowercase letter, met")).toBeOnTheScreen();
    expect(screen.getByLabelText("Must contain at least 1 digit, not met")).toBeOnTheScreen();
  });

  it("hides the checklist once the password is valid and blurred", async () => {
    const user = userEvent.setup();
    await render(<SignUp />);

    await user.type(screen.getByLabelText("Your password"), "Johndoe1");

    expect(screen.queryByText("Must contain at least 1 digit")).not.toBeOnTheScreen();
  });

  it("signs up with the trimmed values", async () => {
    const user = userEvent.setup();
    await render(<SignUp />);

    await fill(user, { name: "John Doe ", email: "johndoe@mail.com", password: "Johndoe1" });
    await user.press(screen.getByRole("button", { name: "Sign up" }));

    expect(signUp).toHaveBeenCalledWith("John Doe", "johndoe@mail.com", "Johndoe1");
  });

  it("shows an error when the email is already registered", async () => {
    signUp.mockResolvedValue({ ok: false, reason: "email-taken" });
    const user = userEvent.setup();
    await render(<SignUp />);

    await fill(user, { name: "John Doe", email: "johndoe@mail.com", password: "Johndoe1" });
    await user.press(screen.getByRole("button", { name: "Sign up" }));

    expect(await screen.findByText("An account with this email already exists.")).toBeOnTheScreen();
  });

  it("switches to sign in from the footer", async () => {
    const user = userEvent.setup();
    await render(<SignUp />);

    await user.press(screen.getByRole("link", { name: "Sign in" }));

    expect(router.replace).toHaveBeenCalledWith("/sign-in");
  });
});
