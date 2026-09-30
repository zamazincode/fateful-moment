import { render, screen } from "@testing-library/react-native";

import { TraitStatCard } from "@/components/dna/trait-stat-card";
import { EyeIcon } from "@/components/icons/eye-icon";

describe("TraitStatCard", () => {
  it("shows the trait and its score", async () => {
    await render(<TraitStatCard label="Vision" value={88} Icon={EyeIcon} />);

    expect(screen.getByText("Vision")).toBeOnTheScreen();
    expect(screen.getByText("88")).toBeOnTheScreen();
    expect(screen.getByLabelText("Vision 88")).toBeOnTheScreen();
  });

  it("fills the bar to the score", async () => {
    await render(<TraitStatCard label="Ethics" value={31} Icon={EyeIcon} />);

    expect(screen.getByTestId("trait-bar")).toHaveStyle({ width: "31%" });
  });
});
