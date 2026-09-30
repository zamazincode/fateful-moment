import * as FileSystem from "expo-file-system";

import { resetSettingsCache } from "@/store/settings";

// Settings persist in an (in-memory) file; start every test from the defaults.
beforeEach(() => {
  (FileSystem as unknown as { __reset: () => void }).__reset();
  resetSettingsCache();
});
