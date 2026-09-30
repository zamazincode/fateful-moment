import { render, screen, userEvent, within } from "@testing-library/react-native";

import { SideMenu } from "@/components/navigation/side-menu";
import { colors } from "@/theme";

jest.mock("react-native-safe-area-context", () => require("react-native-safe-area-context/jest/mock").default);

describe("SideMenu", () => {
  it("lists Scenarios, DNA and Settings", async () => {
    await render(<SideMenu activeRoute="index" onSelect={jest.fn()} />);

    expect(screen.getAllByRole("button").map((item) => item.props.accessibilityLabel)).toEqual([
      "Scenarios",
      "DNA",
      "Settings",
    ]);
  });

  it("marks the current screen with the cyan tint and a dot", async () => {
    await render(<SideMenu activeRoute="dna" onSelect={jest.fn()} />);

    const dna = screen.getByRole("button", { name: "DNA" });
    expect(dna).toBeSelected();
    expect(dna).toHaveStyle({ borderColor: `${colors.primaryStrong}59`, backgroundColor: `${colors.primaryStrong}1A` });
    expect(within(dna).getByText("DNA")).toHaveStyle({ color: colors.primary });
    expect(within(dna).getByTestId("active-dot")).toBeOnTheScreen();

    const scenarios = screen.getByRole("button", { name: "Scenarios" });
    expect(scenarios).not.toBeSelected();
    expect(within(scenarios).getByText("Scenarios")).toHaveStyle({ color: colors.textSecondary });
    expect(screen.getAllByTestId("active-dot")).toHaveLength(1);
  });

  it("reports the picked route", async () => {
    const onSelect = jest.fn();
    const user = userEvent.setup();
    await render(<SideMenu activeRoute="index" onSelect={onSelect} />);

    await user.press(screen.getByRole("button", { name: "Settings" }));

    expect(onSelect).toHaveBeenCalledWith("settings");
  });

  it("uses the 46pt items from the design", async () => {
    await render(<SideMenu activeRoute="index" onSelect={jest.fn()} />);

    expect(screen.getByRole("button", { name: "Settings" })).toHaveStyle({ height: 46, borderColor: colors.surface });
  });
});
