import { fireEvent, render, screen, userEvent } from "@testing-library/react-native";

import { OptionGrid } from "@/components/simulation/option-grid";

const options = ["One", "Two", "Three", "Four", "Five"];

async function layout(width: number) {
  await fireEvent(screen.getByTestId("option-grid"), "layout", { nativeEvent: { layout: { width, height: 300 } } });
}

describe("OptionGrid", () => {
  it("waits for its width before placing the cards", async () => {
    await render(<OptionGrid options={options} stateOf={() => "default"} onPick={jest.fn()} />);

    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("splits the width into two columns with a 12pt gap", async () => {
    await render(<OptionGrid options={options} stateOf={() => "default"} onPick={jest.fn()} />);
    await layout(612);

    expect(screen.getAllByRole("button")).toHaveLength(5);
    expect(screen.getAllByTestId("option-card")[0]).toHaveStyle({ width: 300 });
  });

  it("stops the cards at the design's 345pt on wide screens", async () => {
    await render(<OptionGrid options={options} stateOf={() => "default"} onPick={jest.fn()} />);
    await layout(1200);

    expect(screen.getAllByTestId("option-card")[0]).toHaveStyle({ width: 345 });
  });

  it("reports the picked index and passes each card its state", async () => {
    const onPick = jest.fn();
    const user = userEvent.setup();
    await render(
      <OptionGrid
        options={options}
        stateOf={(index) => (index === 0 ? "passive" : "default")}
        yourChoice={0}
        onPick={onPick}
      />,
    );
    await layout(702);

    await user.press(screen.getByRole("button", { name: "Three" }));

    expect(onPick).toHaveBeenCalledWith(2);
    expect(screen.getByRole("button", { name: "One, your choice" })).toBeDisabled();
  });
});
