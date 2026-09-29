import { render, screen, userEvent } from "@testing-library/react-native";

import { Button, getButtonColors } from "@/components/ui/button";
import { colors, fonts, shadows, sizes } from "@/theme";

describe("Button", () => {
  it("renders an accessible button with its title", async () => {
    await render(<Button title="Continue" />);

    expect(screen.getByRole("button", { name: "Continue" })).toBeOnTheScreen();
  });

  it("calls onPress when pressed", async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    await render(<Button title="Continue" onPress={onPress} />);

    await user.press(screen.getByRole("button"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("is disabled and ignores presses when disabled", async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    await render(<Button title="Continue" onPress={onPress} disabled />);

    const button = screen.getByRole("button");
    await user.press(button);

    expect(button).toBeDisabled();
    expect(onPress).not.toHaveBeenCalled();
  });

  it("defaults to a large primary solid button with a glow", async () => {
    await render(<Button title="Continue" />);

    expect(screen.getByRole("button")).toHaveStyle({
      height: sizes.button,
      backgroundColor: colors.primary,
      boxShadow: shadows.glowPrimary,
    });
    expect(screen.getByText("Continue")).toHaveStyle({ color: colors.textOnPrimary });
  });

  it("uses the muted fill and drops the glow for a disabled primary button", async () => {
    await render(<Button title="Continue" disabled />);

    const button = screen.getByRole("button");
    expect(button).toHaveStyle({ backgroundColor: colors.primaryMuted });
    expect(button).not.toHaveStyle({ boxShadow: shadows.glowPrimary });
  });

  it("renders the outline variant with a tone-colored border", async () => {
    await render(<Button title="Continue" variant="outline" />);

    expect(screen.getByRole("button")).toHaveStyle({
      backgroundColor: "transparent",
      borderColor: colors.primary,
    });
    expect(screen.getByText("Continue")).toHaveStyle({ color: colors.primary });
  });

  it("renders the text variant without padding or fill", async () => {
    await render(<Button title="Continue" variant="text" />);

    expect(screen.getByRole("button")).toHaveStyle({
      paddingHorizontal: 0,
      backgroundColor: "transparent",
    });
  });

  it("renders the danger tone with its glow", async () => {
    await render(<Button title="Delete" tone="danger" />);

    expect(screen.getByRole("button")).toHaveStyle({
      backgroundColor: colors.danger,
      boxShadow: shadows.glowDanger,
    });
    expect(screen.getByText("Delete")).toHaveStyle({ color: colors.textOnDanger });
  });

  it("only uses a fixed height for the large size", async () => {
    await render(<Button title="Start" size="sm" />);

    expect(screen.getByRole("button")).not.toHaveStyle({ height: sizes.button });
  });

  it("lets textStyle override the title style", async () => {
    await render(<Button title="Continue" textStyle={{ fontFamily: fonts.regular }} />);

    expect(screen.getByText("Continue")).toHaveStyle({ fontFamily: fonts.regular });
  });

  it("passes the content color and icon size to icons", async () => {
    const leftIcon = jest.fn(() => null);
    const rightIcon = jest.fn(() => null);
    await render(<Button title="Continue" variant="outline" leftIcon={leftIcon} rightIcon={rightIcon} />);

    expect(leftIcon).toHaveBeenCalledWith({ color: colors.primary, size: sizes.icon });
    expect(rightIcon).toHaveBeenCalledWith({ color: colors.primary, size: sizes.icon });
  });
});

describe("getButtonColors", () => {
  it("uses light content for the secondary tone on the dark background", () => {
    expect(getButtonColors("secondary", "solid", false)).toEqual({
      background: colors.surface,
      content: colors.text,
    });
    expect(getButtonColors("secondary", "outline", false).content).toBe(colors.text);
  });

  it("switches the secondary solid fill to gray when disabled", () => {
    expect(getButtonColors("secondary", "solid", true).background).toBe(colors.textSecondary);
  });
});
