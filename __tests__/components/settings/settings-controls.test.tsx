import { fireEvent, render, screen, userEvent } from "@testing-library/react-native";
import { Text } from "react-native";

import { ProfileCard } from "@/components/settings/profile-card";
import { SettingRow } from "@/components/settings/setting-row";
import { SettingSwitch } from "@/components/settings/setting-switch";
import { TrackPicker } from "@/components/settings/track-picker";
import { VolumeControl } from "@/components/settings/volume-control";
import { tracks } from "@/data/tracks";

beforeEach(() => jest.clearAllMocks());

describe("SettingRow", () => {
  it("shows the label, the description and the control", async () => {
    await render(<SettingRow label="Music" description="Plays in the menus." control={<Text>control</Text>} />);

    expect(screen.getByText("Music")).toBeOnTheScreen();
    expect(screen.getByText("Plays in the menus.")).toBeOnTheScreen();
    expect(screen.getByText("control")).toBeOnTheScreen();
  });
});

describe("SettingSwitch", () => {
  it("reports the new value", async () => {
    const onValueChange = jest.fn();
    await render(<SettingSwitch value={false} onValueChange={onValueChange} accessibilityLabel="Video sound" />);

    await fireEvent(screen.getByLabelText("Video sound"), "valueChange", true);

    expect(onValueChange).toHaveBeenCalledWith(true);
  });
});

describe("VolumeControl", () => {
  it("shows the level and steps it up and down by 10%", async () => {
    const onChange = jest.fn();
    await render(<VolumeControl value={0.5} onChange={onChange} />);
    expect(screen.getByText("50%")).toBeOnTheScreen();

    await userEvent.press(screen.getByLabelText("Raise volume"));
    expect(onChange).toHaveBeenLastCalledWith(0.6);

    await userEvent.press(screen.getByLabelText("Lower volume"));
    expect(onChange).toHaveBeenLastCalledWith(0.4);
  });

  it("jumps to a tapped bar", async () => {
    const onChange = jest.fn();
    await render(<VolumeControl value={0.5} onChange={onChange} />);

    await userEvent.press(screen.getByLabelText("Volume 20%"));

    expect(onChange).toHaveBeenCalledWith(0.2);
  });

  it("can't go below 0% or above 100%", async () => {
    const onChange = jest.fn();
    const view = await render(<VolumeControl value={0} onChange={onChange} />);
    expect(screen.getByLabelText("Lower volume")).toBeDisabled();

    await view.rerender(<VolumeControl value={1} onChange={onChange} />);
    expect(screen.getByLabelText("Raise volume")).toBeDisabled();
  });
});

describe("TrackPicker", () => {
  it("marks the current track and picks another", async () => {
    const onSelect = jest.fn();
    await render(<TrackPicker tracks={tracks} selectedId={tracks[0].id} onSelect={onSelect} />);

    const [first, second] = tracks.map((track) => screen.getByLabelText(`${track.title} by ${track.artist}`));
    expect(first).toBeSelected();
    expect(second).not.toBeSelected();

    await userEvent.press(second);

    expect(onSelect).toHaveBeenCalledWith(1);
  });
});

describe("ProfileCard", () => {
  it("shows the initials, name and email", async () => {
    await render(<ProfileCard user={{ name: "John Doe", email: "johndoe@mail.com" }} />);

    expect(screen.getByText("JD", { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.getByText("John Doe")).toBeOnTheScreen();
    expect(screen.getByText("johndoe@mail.com")).toBeOnTheScreen();
    expect(screen.queryByText(/Signed in with/)).toBeNull();
  });

  it("names the provider of a demo user", async () => {
    await render(
      <ProfileCard user={{ name: "Google User", email: "google.demo@fatefulmoment.app", provider: "google" }} />,
    );

    expect(screen.getByText("GU", { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.getByText("Signed in with Google")).toBeOnTheScreen();
  });
});
