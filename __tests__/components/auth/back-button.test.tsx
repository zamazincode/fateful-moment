import { render, screen, userEvent } from "@testing-library/react-native";
import { router } from "expo-router";

import { BackButton } from "@/components/auth/back-button";

jest.mock("expo-router", () => ({ router: { back: jest.fn(), replace: jest.fn(), canGoBack: jest.fn() } }));

beforeEach(() => jest.clearAllMocks());

describe("BackButton", () => {
  it("is the 40x40 button from the design", async () => {
    await render(<BackButton />);

    expect(screen.getByRole("button", { name: "Go back" })).toHaveStyle({ width: 40, height: 40 });
  });

  it("goes back when there is history", async () => {
    jest.mocked(router.canGoBack).mockReturnValue(true);
    const user = userEvent.setup();
    await render(<BackButton />);

    await user.press(screen.getByRole("button", { name: "Go back" }));

    expect(router.back).toHaveBeenCalled();
  });

  it("falls back to the welcome screen without history", async () => {
    jest.mocked(router.canGoBack).mockReturnValue(false);
    const user = userEvent.setup();
    await render(<BackButton />);

    await user.press(screen.getByRole("button", { name: "Go back" }));

    expect(router.replace).toHaveBeenCalledWith("/welcome");
  });
});
