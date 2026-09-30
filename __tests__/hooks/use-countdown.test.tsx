import { act, render } from "@testing-library/react-native";
import { Animated } from "react-native";

import { useCountdown } from "@/hooks/use-countdown";

let progress: Animated.Value | null = null;

function Countdown({ running, onExpire }: { running: boolean; onExpire: () => void }) {
  progress = useCountdown(1000, running, onExpire);
  return null;
}

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe("useCountdown", () => {
  it("expires after the duration while running", async () => {
    const onExpire = jest.fn();
    await render(<Countdown running onExpire={onExpire} />);

    await act(() => jest.advanceTimersByTime(999));
    expect(onExpire).not.toHaveBeenCalled();

    await act(() => jest.advanceTimersByTime(1));
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it("starts full", async () => {
    await render(<Countdown running={false} onExpire={jest.fn()} />);

    expect((progress as unknown as { __getValue: () => number }).__getValue()).toBe(1);
  });

  it("never expires while stopped", async () => {
    const onExpire = jest.fn();
    await render(<Countdown running={false} onExpire={onExpire} />);

    await act(() => jest.advanceTimersByTime(5000));

    expect(onExpire).not.toHaveBeenCalled();
  });

  it("is cancelled when stopped half way", async () => {
    const onExpire = jest.fn();
    const { rerender } = await render(<Countdown running onExpire={onExpire} />);

    await act(() => jest.advanceTimersByTime(500));
    await rerender(<Countdown running={false} onExpire={onExpire} />);
    await act(() => jest.advanceTimersByTime(5000));

    expect(onExpire).not.toHaveBeenCalled();
  });

  it("calls the latest onExpire", async () => {
    const first = jest.fn();
    const latest = jest.fn();
    const { rerender } = await render(<Countdown running onExpire={first} />);
    await rerender(<Countdown running onExpire={latest} />);

    await act(() => jest.advanceTimersByTime(1000));

    expect(first).not.toHaveBeenCalled();
    expect(latest).toHaveBeenCalledTimes(1);
  });
});
