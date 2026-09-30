import { render } from "@testing-library/react-native";
import { useRef } from "react";
import { ScrollView } from "react-native";

import { useScrollResetOnLeave } from "@/hooks/use-scroll-reset-on-leave";

// The cleanup of a focus effect runs when the screen loses focus.
let blur: (() => void) | undefined;
jest.mock("expo-router", () => ({
  useFocusEffect: (callback: () => () => void) => {
    blur = callback();
  },
}));

function Screen() {
  const ref = useRef<ScrollView>(null);
  useScrollResetOnLeave(ref);
  return <ScrollView ref={ref} testID="scroll" />;
}

describe("useScrollResetOnLeave", () => {
  it("scrolls back to the top when the screen is left", async () => {
    const scrollTo = jest.spyOn(ScrollView.prototype, "scrollTo").mockImplementation(() => {});
    await render(<Screen />);
    expect(scrollTo).not.toHaveBeenCalled();

    blur?.();

    expect(scrollTo).toHaveBeenCalledWith({ x: 0, y: 0, animated: false });
  });
});
