import { render, screen, userEvent } from "@testing-library/react-native";
import { useNavigation } from "expo-router";
import { DrawerActions } from "expo-router/react-navigation";

import { MenuButton } from "@/components/navigation/menu-button";

jest.mock("expo-router", () => ({ useNavigation: jest.fn() }));

describe("MenuButton", () => {
  it("opens the side menu", async () => {
    const dispatch = jest.fn();
    jest.mocked(useNavigation).mockReturnValue({ dispatch } as never);
    const user = userEvent.setup();
    await render(<MenuButton />);

    await user.press(screen.getByRole("button", { name: "Open menu" }));

    expect(dispatch).toHaveBeenCalledWith(DrawerActions.openDrawer());
  });
});
