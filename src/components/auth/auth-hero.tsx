import { Image } from "expo-image";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui/app-text";
import { fonts, radius, spacing, typography } from "@/theme";

const LOGO_SIZE = 148;

type AuthTitleProps = {
  title: string;
  subtitle?: ReactNode;
};

export function AuthTitle({ title, subtitle }: AuthTitleProps) {
  return (
    <View style={styles.heading}>
      <AppText style={styles.title} accessibilityRole="header">
        {title}
      </AppText>
      {subtitle ? (
        <AppText color="textSecondary" style={styles.subtitle}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

type AuthHeroProps = AuthTitleProps & {
  leading?: ReactNode;
};

export function AuthHero({ title, subtitle, leading }: AuthHeroProps) {
  return (
    <View style={styles.hero}>
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <Image
        source={require("@/assets/icon.png")}
        style={styles.logo}
        contentFit="cover"
        accessibilityIgnoresInvertColors
      />
      <AuthTitle title={title} subtitle={subtitle} />
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    gap: spacing.xxl,
  },
  leading: {
    position: "absolute",
    top: -spacing.md,
    left: 0,
    zIndex: 1,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: radius.full,
  },
  heading: {
    gap: spacing.xs,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: typography.sectionTitle.fontSize,
    lineHeight: typography.sectionTitle.lineHeight,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
  },
});
