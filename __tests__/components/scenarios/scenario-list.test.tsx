import { render, screen, userEvent } from "@testing-library/react-native";

import { DIMMED_OPACITY } from "@/components/scenarios/scenario-card";
import { ScenarioList } from "@/components/scenarios/scenario-list";
import { scenarios } from "@/data/scenarios";

const [iraq, cuba] = scenarios;

describe("ScenarioList", () => {
  it("shows a card for each scenario", async () => {
    await render(<ScenarioList scenarios={[iraq, cuba]} onStart={jest.fn()} inset={24} />);

    expect(screen.getByText(iraq.title)).toBeOnTheScreen();
    expect(screen.getByText(cuba.title)).toBeOnTheScreen();
    expect(screen.getAllByTestId("scenario-card")).toHaveLength(2);
  });

  it("hands the started scenario back", async () => {
    const onStart = jest.fn();
    const user = userEvent.setup();
    await render(<ScenarioList scenarios={[iraq, cuba]} onStart={onStart} inset={24} />);

    await user.press(screen.getByRole("button", { name: `Start ${cuba.title}` }));

    expect(onStart).toHaveBeenCalledWith(cuba);
  });

  it("fades every card but the selected one", async () => {
    await render(<ScenarioList scenarios={[iraq, cuba]} selectedId={iraq.id} onStart={jest.fn()} inset={24} />);

    const [first, second] = screen.getAllByTestId("scenario-card");
    expect(first).not.toHaveStyle({ opacity: DIMMED_OPACITY });
    expect(second).toHaveStyle({ opacity: DIMMED_OPACITY });
  });

  it("dims nothing while no scenario is selected", async () => {
    await render(<ScenarioList scenarios={[iraq, cuba]} onStart={jest.fn()} inset={24} />);

    for (const card of screen.getAllByTestId("scenario-card")) {
      expect(card).not.toHaveStyle({ opacity: DIMMED_OPACITY });
    }
  });
});
