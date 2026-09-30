import { render, screen, userEvent } from "@testing-library/react-native";

import { OptionCard, PASSIVE_OPACITY } from "@/components/simulation/option-card";
import { colors, radius } from "@/theme";

describe("OptionCard", () => {
  it("is a translucent card with a 1pt light border by default", async () => {
    await render(<OptionCard label="Wait for Signal from Moscow" />);

    expect(screen.getByRole("button", { name: "Wait for Signal from Moscow" })).toHaveStyle({
      minHeight: 66,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.text,
      backgroundColor: `${colors.surface}A1`,
    });
  });

  it("lights up with the cyan gradient and a 2pt border when selected", async () => {
    await render(<OptionCard label="Wait for Signal from Moscow" state="selected" />);

    const card = screen.getByRole("button");
    expect(card).toBeSelected();
    expect(card).toHaveStyle({ borderWidth: 2 });
    const [style] = [card.props.style].flat(3).filter((entry) => entry?.experimental_backgroundImage);
    expect(style.experimental_backgroundImage).toContain(
      `linear-gradient(91.21deg, ${colors.surface}A1 0%, ${colors.primary}A1 50%, ${colors.surface}A1 100%)`,
    );
  });

  it("fades a passive option to 48% and ignores presses", async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    await render(<OptionCard label="Signal US Ships with Sonar" state="passive" onPress={onPress} />);

    const card = screen.getByRole("button");
    expect(card).toHaveStyle({ opacity: PASSIVE_OPACITY });
    expect(card).toBeDisabled();
    await user.press(card);
    expect(onPress).not.toHaveBeenCalled();
  });

  it("reports a press", async () => {
    const onPress = jest.fn();
    const user = userEvent.setup();
    await render(<OptionCard label="Signal US Ships with Sonar" onPress={onPress} />);

    await user.press(screen.getByRole("button"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("wears the Your Choice badge on the first decision", async () => {
    await render(<OptionCard label="Wait for Signal from Moscow" state="passive" yourChoice />);

    expect(screen.getByText("Your Choice")).toBeOnTheScreen();
    expect(screen.getByRole("button", { name: "Wait for Signal from Moscow, your choice" })).toBeOnTheScreen();
  });

  it("can be switched off while another option is being revealed", async () => {
    await render(<OptionCard label="Signal US Ships with Sonar" disabled />);

    expect(screen.getByRole("button")).toBeDisabled();
  });
});
