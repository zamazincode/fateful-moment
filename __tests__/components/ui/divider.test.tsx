import { render, screen } from "@testing-library/react-native";

import { Divider } from "@/components/ui/divider";

describe("Divider", () => {
  it("renders its label between the lines", async () => {
    await render(<Divider label="OR" />);

    expect(screen.getByText("OR")).toBeOnTheScreen();
  });

  it("renders a plain line without a label", async () => {
    await render(<Divider />);

    expect(screen.queryByText(/./)).not.toBeOnTheScreen();
  });
});
