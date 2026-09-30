import { render, screen, userEvent } from "@testing-library/react-native";
import { router } from "expo-router";

import { BackArrowButton } from "@/components/navigation/back-arrow-button";

jest.mock("expo-router", () => ({ router: { back: jest.fn() } }));

describe("BackArrowButton", () => {
  it("goes back by default", async () => {
    const user = userEvent.setup();
    await render(<BackArrowButton />);

    await user.press(screen.getByRole("button", { name: "Go back" }));

    expect(router.back).toHaveBeenCalled();
  });

  it("runs a given handler instead", async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    await render(<BackArrowButton onPress={onPress} />);

    await user.press(screen.getByRole("button", { name: "Go back" }));

    expect(onPress).toHaveBeenCalled();
  });
});
