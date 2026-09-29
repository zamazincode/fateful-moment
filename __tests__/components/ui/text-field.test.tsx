import { render, screen, userEvent } from "@testing-library/react-native";
import { Text } from "react-native";

import { PasswordField } from "@/components/auth/password-field";
import { TextField } from "@/components/ui/text-field";

describe("TextField", () => {
  it("is labelled by its placeholder and reports typed text", async () => {
    const onChangeText = jest.fn();
    const user = userEvent.setup();
    await render(<TextField placeholder="Full Name" onChangeText={onChangeText} />);

    await user.type(screen.getByLabelText("Full Name"), "Jo");

    expect(onChangeText).toHaveBeenLastCalledWith("Jo");
  });

  it("shows the error message under the field", async () => {
    await render(<TextField placeholder="Full Name" value="J D" error="Enter at least 3 characters." />);

    expect(screen.getByText("Enter at least 3 characters.")).toBeOnTheScreen();
  });

  it("shows the leading icon only while the field is empty", async () => {
    const { rerender } = await render(
      <TextField placeholder="Email" value="" leading={<Text>icon</Text>} />,
    );
    expect(screen.getByText("icon")).toBeOnTheScreen();

    await rerender(<TextField placeholder="Email" value="john" leading={<Text>icon</Text>} />);
    expect(screen.queryByText("icon")).not.toBeOnTheScreen();
  });

  it("renders no message when there is no error", async () => {
    await render(<TextField placeholder="Full Name" value="John" />);

    expect(screen.queryByText(/./)).not.toBeOnTheScreen();
  });
});

describe("PasswordField", () => {
  it("hides the password until the toggle is pressed", async () => {
    const user = userEvent.setup();
    await render(<PasswordField placeholder="Your password" value="Johndoe1" />);

    expect(screen.getByLabelText("Your password")).toHaveProp("secureTextEntry", true);

    await user.press(screen.getByRole("button", { name: "Show password" }));

    expect(screen.getByLabelText("Your password")).toHaveProp("secureTextEntry", false);
    expect(screen.getByRole("button", { name: "Hide password" })).toBeOnTheScreen();
  });
});
