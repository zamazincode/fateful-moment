import * as Haptics from "expo-haptics";

import { getSettings } from "@/store/settings";

// Every call is a no-op while haptics are off in Settings. Feedback is fire and forget:
// a device without a vibration motor must not break the action it accompanies.
function run(feedback: () => Promise<void>) {
  if (!getSettings().haptics) return;
  feedback().catch(() => {});
}

// Only the simulation vibrates: starting one and picking an option.
export const haptics = {
  start: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  choose: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
};
