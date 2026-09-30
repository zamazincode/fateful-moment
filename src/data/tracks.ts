import type { AudioSource } from "expo-audio";

export type Track = {
  id: string;
  title: string;
  artist: string;
  source: AudioSource;
};

// Royalty free, from pixabay.com.
export const tracks: Track[] = [
  {
    id: "doomed-romance",
    title: "Doomed Romance",
    artist: "Geoff Harvey",
    source: require("@/assets/musics/geoffharvey-doomed-romance.mp3"),
  },
  {
    id: "there-must-be-a-way-out",
    title: "There Must Be A Way Out Of This",
    artist: "UniqueCreativeAudio",
    source: require("@/assets/musics/uniquecreativeaudio-there-must-be-a-way-out-of-this-instrumental.mp3"),
  },
];
