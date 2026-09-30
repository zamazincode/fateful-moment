import {
	Pressable,
	StyleSheet,
	View,
	type StyleProp,
	type ViewStyle,
} from "react-native";

import { SIMULATION_YELLOW } from "@/components/simulation/colors";
import { AppText } from "@/components/ui/app-text";
import { colors, fonts, radius, spacing, typography } from "@/theme";

// 345x66, 16pt corners, 8/16 padding.
export const OPTION_MAX_WIDTH = 345;
const OPTION_MIN_HEIGHT = 66;
// Passive (already watched) options keep the selected look at 48%.
export const PASSIVE_OPACITY = 0.48;
const BADGE_HEIGHT = 30;

// Figma: rgba(15, 23, 43, 0.63), the surface at 63%.
const DEFAULT_FILL = `${colors.surface}A1`;
// Figma: 91.21deg surface -> cyan -> surface, all at 63%.
const SELECTED_FILL = `linear-gradient(91.21deg, ${colors.surface}A1 0%, ${colors.primary}A1 50%, ${colors.surface}A1 100%)`;
// The light diagonal bands over the selected fill, fitted from the screenshot:
// five bands at 113deg, lit / clear / lit / clear / lit.
const SHEEN = "rgba(255, 255, 255, 0.15)";
const SELECTED_SHEEN = `linear-gradient(113deg, ${SHEEN} 0%, ${SHEEN} 23%, transparent 23%, transparent 40%, ${SHEEN} 40%, ${SHEEN} 60%, transparent 60%, transparent 77%, ${SHEEN} 77%, ${SHEEN} 100%)`;

export type OptionState = "default" | "selected" | "passive";

type OptionCardProps = {
	label: string;
	state?: OptionState;
	yourChoice?: boolean;
	disabled?: boolean;
	onPress?: () => void;
	style?: StyleProp<ViewStyle>;
};

export function OptionCard({
	label,
	state = "default",
	yourChoice = false,
	disabled = false,
	onPress,
	style,
}: OptionCardProps) {
	const lit = state !== "default";

	return (
		<View testID="option-card" style={[styles.wrapper, style]}>
			<Pressable
				accessibilityRole="button"
				accessibilityLabel={
					yourChoice ? `${label}, your choice` : label
				}
				accessibilityState={{
					selected: state === "selected",
					disabled: disabled || state === "passive",
				}}
				disabled={disabled || state === "passive"}
				onPress={onPress}
				style={({ pressed }) => [
					styles.card,
					lit ? styles.lit : styles.default,
					state === "passive" && styles.passive,
					pressed && styles.pressed,
				]}
			>
				{/* Short labels sit in the middle, long ones wrap left aligned. */}
				<AppText style={styles.label}>{label}</AppText>
			</Pressable>

			{yourChoice ? (
				<View pointerEvents="none" style={styles.badge}>
					<AppText style={styles.badgeText}>Your Choice</AppText>
				</View>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		maxWidth: OPTION_MAX_WIDTH,
	},
	card: {
		minHeight: OPTION_MIN_HEIGHT,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: spacing.xs,
		paddingHorizontal: spacing.md,
		borderRadius: radius.lg,
		borderCurve: "continuous",
		borderColor: colors.text,
	},
	default: {
		borderWidth: 1,
		backgroundColor: DEFAULT_FILL,
	},
	lit: {
		borderWidth: 2,
		experimental_backgroundImage: `${SELECTED_SHEEN}, ${SELECTED_FILL}`,
	},
	passive: {
		opacity: PASSIVE_OPACITY,
	},
	pressed: {
		opacity: 0.8,
	},
	label: {
		fontFamily: fonts.regular,
		fontSize: typography.label.fontSize,
		lineHeight: typography.label.lineHeight,
		textAlign: "left",
	},
	badge: {
		position: "absolute",
		top: -BADGE_HEIGHT / 2,
		alignSelf: "center",
		height: BADGE_HEIGHT,
		justifyContent: "center",
		paddingHorizontal: spacing.md,
		borderRadius: radius.full,
		backgroundColor: SIMULATION_YELLOW,
	},
	badgeText: {
		fontFamily: fonts.bold,
		fontSize: typography.label.fontSize,
		lineHeight: typography.label.lineHeight,
	},
});
