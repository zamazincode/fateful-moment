export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
  huge: 64,
} as const;

export const radius = {
  md: 14, // buttons, icon buttons
  lg: 16, // option rows, swatches, inputs
  xl: 40, // cards
  full: 9999, // pills, beacons, progress bars
} as const;

export const sizes = {
  button: 58,
  iconButton: 48,
  icon: 20,
  option: 54,
  beacon: 16,
} as const;

// RN `boxShadow` strings (New Architecture).
export const shadows = {
  elevated: "0px 20px 25px rgba(0, 0, 0, 0.1), 0px 8px 10px rgba(0, 0, 0, 0.1)",
  glowPrimary: "0px 0px 10px rgba(6, 182, 212, 0.2)",
  glowDanger: "0px 0px 10px rgba(239, 68, 68, 0.2)",
  beaconPrimary: "0px 0px 15px rgba(6, 182, 212, 0.5)",
  beaconDanger: "0px 0px 15px rgba(239, 68, 68, 0.5)",
  beaconSuccess: "0px 0px 15px rgba(34, 197, 94, 0.5)",
} as const;
