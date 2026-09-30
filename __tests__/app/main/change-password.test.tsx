import { render, screen, userEvent } from "@testing-library/react-native";
import { router } from "expo-router";

import ChangePassword from "@/app/(app)/change-password";
import { useSession } from "@/store/session";

jest.mock("react-native-safe-area-context", () => require("react-native-safe-area-context/jest/mock").default);
jest.mock("expo-router", () => ({ router: { back: jest.fn() } }));
jest.mock("@/store/session", () => ({ useSession: jest.fn() }));

const changePassword = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  changePassword.mockResolvedValue({ ok: true });
  jest.mocked(useSession).mockReturnValue({
    user: { name: "John Doe", email: "johndoe@mail.com" },
    status: "ready",
    signIn: jest.fn(),
    signUp: jest.fn(),
    signInWithProvider: jest.fn(),
    signOut: jest.fn(),
    changePassword,
    deleteAccount: jest.fn(),
  });
});

async function fill(current: string, next: string) {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Current password"), current);
  await user.type(screen.getByLabelText("New password"), next);
  return user;
}

describe("Change password screen", () => {
  it("keeps Save disabled until the new password passes the rules", async () => {
    await render(<ChangePassword />);
    const save = screen.getByRole("button", { name: "Save Password" });
    expect(save).toBeDisabled();

    await fill("Johndoe1", "short");
    expect(save).toBeDisabled();
  });

  it("won't reuse the current password", async () => {
    await render(<ChangePassword />);

    await fill("Johndoe1", "Johndoe1");

    expect(screen.getByRole("button", { name: "Save Password" })).toBeDisabled();
    expect(screen.getByText("Choose a password different from the current one.")).toBeOnTheScreen();
  });

  it("saves and goes back", async () => {
    await render(<ChangePassword />);

    const user = await fill("Johndoe1", "Newpass12");
    await user.press(screen.getByRole("button", { name: "Save Password" }));

    expect(changePassword).toHaveBeenCalledWith("Johndoe1", "Newpass12");
    expect(router.back).toHaveBeenCalled();
  });

  it("says when the current password is wrong", async () => {
    changePassword.mockResolvedValue({ ok: false, reason: "wrong-password" });
    await render(<ChangePassword />);

    const user = await fill("Wrong123", "Newpass12");
    await user.press(screen.getByRole("button", { name: "Save Password" }));

    expect(screen.getByText("Your current password is wrong.")).toBeOnTheScreen();
    expect(router.back).not.toHaveBeenCalled();
  });
});
