import { router } from "expo-router";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppHeader } from "@/components/navigation/app-header";
import { MenuButton } from "@/components/navigation/menu-button";
import { ProfileCard } from "@/components/settings/profile-card";
import { SettingRow } from "@/components/settings/setting-row";
import { SettingSwitch } from "@/components/settings/setting-switch";
import { TrackPicker } from "@/components/settings/track-picker";
import { VolumeControl } from "@/components/settings/volume-control";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { ScreenTitle } from "@/components/ui/screen-title";
import { useMusicPlayer } from "@/store/music-player";
import { useSession } from "@/store/session";
import { updateSettings, useSettings } from "@/store/settings";
import { colors, spacing } from "@/theme";

export default function Settings() {
  const insets = useSafeAreaInsets();
  const { user, signOut, deleteAccount } = useSession();
  const player = useMusicPlayer();
  const settings = useSettings();

  function confirmDelete() {
    Alert.alert(
      "Delete account?",
      "Your account and its password are removed from this device. This can't be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: deleteAccount },
      ],
    );
  }

  return (
    <View style={styles.screen}>
      <AppHeader left={<MenuButton />} />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingLeft: insets.left + spacing.lg,
            paddingRight: insets.right + spacing.lg,
            paddingBottom: insets.bottom + spacing.lg,
          },
        ]}
      >
        <ScreenTitle>Settings</ScreenTitle>

        <View style={styles.columns}>
          <View style={styles.column}>
            <Panel title="Account" style={styles.fill}>
              {user ? <ProfileCard user={user} /> : null}
              <View style={styles.actions}>
                {user && !user.provider ? (
                  <Button
                    title="Change Password"
                    tone="secondary"
                    variant="outline"
                    size="md"
                    onPress={() => router.push("/change-password")}
                  />
                ) : null}
                <Button title="Sign Out" tone="secondary" variant="outline" size="md" onPress={signOut} />
                <Button title="Delete Account" tone="danger" variant="text" size="md" onPress={confirmDelete} />
              </View>
            </Panel>

            <Panel title="Haptics">
              <SettingRow
                label="Haptic feedback"
                description="Vibrations when a simulation starts and when you pick an option."
                control={
                  <SettingSwitch
                    value={settings.haptics}
                    onValueChange={(haptics) => updateSettings({ haptics })}
                    accessibilityLabel="Haptic feedback"
                  />
                }
              />
            </Panel>
          </View>

          <View style={styles.column}>
            <Panel title="Sound" style={styles.fill}>
              <View style={styles.rows}>
                <SettingRow
                  label="Music"
                  description="Plays in the menus and the briefing; silent during a simulation."
                  control={
                    <SettingSwitch
                      value={player.playing}
                      onValueChange={(on) => (on ? player.play() : player.pause())}
                      accessibilityLabel="Music"
                    />
                  }
                />
                <SettingRow
                  label="Volume"
                  control={<VolumeControl value={player.volume} onChange={player.setVolume} />}
                />
                <TrackPicker tracks={player.tracks} selectedId={player.track.id} onSelect={player.select} />
                <SettingRow
                  label="Video sound"
                  description="Sound of the scenario videos."
                  control={
                    <SettingSwitch
                      value={settings.videoSound}
                      onValueChange={(videoSound) => updateSettings({ videoSound })}
                      accessibilityLabel="Video sound"
                    />
                  }
                />
              </View>
            </Panel>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  columns: {
    flexDirection: "row",
    gap: spacing.md,
  },
  column: {
    flex: 1,
    gap: spacing.md,
  },
  fill: {
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  rows: {
    gap: spacing.md,
  },
});
