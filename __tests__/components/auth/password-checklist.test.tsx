import { render, screen } from "@testing-library/react-native";

import { PasswordChecklist } from "@/components/auth/password-checklist";
import { colors } from "@/theme";

describe("PasswordChecklist", () => {
  it("marks each rule as met or not met", async () => {
    await render(<PasswordChecklist password="Johd" />);

    expect(screen.getByLabelText("Must be at least 8 characters long, not met")).toBeOnTheScreen();
    expect(screen.getByLabelText("Must contain at least 1 uppercase letter, met")).toBeOnTheScreen();
    expect(screen.getByLabelText("Must contain at least 1 lowercase letter, met")).toBeOnTheScreen();
    expect(screen.getByLabelText("Must contain at least 1 digit, not met")).toBeOnTheScreen();
  });

  it("brightens the text of met rules", async () => {
    await render(<PasswordChecklist password="Johd" />);

    expect(screen.getByText("Must contain at least 1 uppercase letter")).toHaveStyle({ color: colors.text });
    expect(screen.getByText("Must contain at least 1 digit")).toHaveStyle({ color: colors.textSecondary });
  });
});
