import { IMusicAdapter } from "./interface";
import { NativeMusicAdapter } from "./native";
import { SubsonicMusicAdapter } from "./subsonic";
import { SubsonicConfig } from "./subsonic/client";

let currentAdapter: IMusicAdapter = new NativeMusicAdapter();

export const getAdapter = (): IMusicAdapter => {
  return currentAdapter;
};

export const useNativeAdapter = () => {
  currentAdapter = new NativeMusicAdapter();
};

export const useSubsonicAdapter = (config: SubsonicConfig) => {
  currentAdapter = new SubsonicMusicAdapter(config);
};
