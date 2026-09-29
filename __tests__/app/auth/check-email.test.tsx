import { render, screen, userEvent } from "@testing-library/react-native";
import { router } from "expo-router";

import CheckEmail from "@/app/(auth)/check-email";

jest.mock("expo-router", () => ({
  router: { dismissTo: jest.fn(), back: jest.fn(), replace: jest.fn(), canGoBack: jest.fn(() => true) },
  useLocalSearchParams: () => ({ email: "johndoe@mail.com" }),
}));

beforeEach(() => jest.clearAllMocks());

describe("Check email screen", () => {
  it("confirms where the instructions were sent", async () => {
    await render(<CheckEmail />);

    expect(screen.getByRole("header", { name: "Check Your Email" })).toBeOnTheScreen();
    expect(screen.getByText("We've sent password reset instructions to johndoe@mail.com")).toBeOnTheScreen();
  });

  it("returns to the sign in screen", async () => {
    const user = userEvent.setup();
    await render(<CheckEmail />);

    await user.press(screen.getByRole("button", { name: "Back to Sign in" }));

    expect(router.dismissTo).toHaveBeenCalledWith("/sign-in");
  });
});
