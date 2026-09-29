import { router } from "expo-router";

import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { IconButton } from "@/components/ui/icon-button";

// Figma: 40x40, smaller than the style guide's generic icon button.
const BACK_BUTTON_SIZE = 40;

export function BackButton() {
  return (
    <IconButton
      accessibilityLabel="Go back"
      size={BACK_BUTTON_SIZE}
      onPress={() => (router.canGoBack() ? router.back() : router.replace("/welcome"))}
    >
      <ArrowLeftIcon />
    </IconButton>
  );
}
