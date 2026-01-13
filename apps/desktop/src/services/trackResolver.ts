import type { Track } from "@soundx/services";
import { getBaseURL } from "../https";
import { useAuthStore } from "../store/auth";

interface ResolveOptions {
  cacheEnabled: boolean;
}

/**
 * Resolves a track into a playable URI for the desktop player
 */
export const resolveTrackUri = async (
  track: Track,
  options: ResolveOptions
): Promise<string> => {
  const { cacheEnabled } = options;

  if (!track.path) {
    console.warn(`[TrackResolver] Track ${track.id} has no path`);
    return "";
  }

  // 1. Construct the remote URI
  const remoteUri = track.path.startsWith("http")
    ? track.path
    : `${getBaseURL()}${track.path}`;

  // 2. Check for cached version if enabled
  if (cacheEnabled && track.id && (window as any).ipcRenderer) {
    try {
      console.log(`[TrackResolver] Checking cache for trackId: ${track.id}, path: ${track.path}`);
      const cachedPath = await (window as any).ipcRenderer.invoke("cache:check", track.id, track.path);
      
      if (cachedPath) {
        console.log(`[TrackResolver] Cache hit! URI: ${cachedPath}`);
        return cachedPath;
      }

      // 3. If not cached, trigger background download
      const token = useAuthStore.getState().token;
      console.log(`[TrackResolver] Cache miss for track ${track.id}, requesting download. URL: ${remoteUri}, Token present: ${!!token}`);
      (window as any).ipcRenderer.invoke("cache:download", track.id, remoteUri, token).then((result: string | null) => {
        console.log(`[TrackResolver] Download task finished. Result: ${result}`);
      }).catch((e: any) =>
        console.error("[TrackResolver] Cache download IPC failed", e)
      );
    } catch (error) {
      console.error("[TrackResolver] IPC communication failed", error);
    }
  }

  // 4. Return remote URI by default
  return remoteUri;
};

/**
 * Resolves artwork URI
 */
export const resolveArtworkUri = (track: Track): string | undefined => {
  if (!track.cover) return undefined
  
  return track.cover.startsWith("http")
    ? track.cover
    : `${getBaseURL()}${track.cover}`;
};
