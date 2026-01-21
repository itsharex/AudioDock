import { IMusicAdapter } from "../interface";
import { NativeAlbumAdapter } from "./album";
import { NativeArtistAdapter } from "./artist";
import { NativeAuthAdapter } from "./auth";
import { NativeTrackAdapter } from "./track";
import { NativeUserAdapter } from "./user";

export class NativeMusicAdapter implements IMusicAdapter {
  track = new NativeTrackAdapter();
  album = new NativeAlbumAdapter();
  artist = new NativeArtistAdapter();
  user = new NativeUserAdapter();
  auth = new NativeAuthAdapter();
}
