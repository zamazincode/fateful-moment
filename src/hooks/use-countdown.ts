import { useEffect, useRef, useState } from "react";
import { Animated, Easing } from "react-native";

// Counts `duration` ms down while `running`. `progress` goes 1 -> 0 on the
// native driver for the bar and vignette; `onExpire` fires from a plain timer,
// so it doesn't depend on the animation finishing. Stopping freezes the bar.
export function useCountdown(duration: number, running: boolean, onExpire: () => void) {
  const [progress] = useState(() => new Animated.Value(1));
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    if (!running) return;
    const animation = Animated.timing(progress, {
      toValue: 0,
      duration,
      easing: Easing.linear,
      useNativeDriver: true,
    });
    animation.start();
    const timer = setTimeout(() => onExpireRef.current(), duration);
    return () => {
      animation.stop();
      clearTimeout(timer);
    };
  }, [duration, running, progress]);

  return progress;
}
