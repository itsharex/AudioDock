import { ISuccessResponse, User } from "../../models";
import { IAuthAdapter, IUserAdapter } from "../interface-user-auth";
import { SubsonicClient } from "./client";
import { mapSubsonicAlbumToAlbum, mapSubsonicSongToTrack } from "./mapper";
import { SubsonicAlbum, SubsonicChild } from "./types";

export class SubsonicUserAdapter implements IUserAdapter {
    constructor(private client: SubsonicClient) {}

    private response<T>(data: T): ISuccessResponse<T> {
        return {
            code: 200,
            message: "success",
            data
        };
    }

  async addToHistory(trackId: number, userId: number, progress: number = 0, deviceName?: string, deviceId?: number, isSyncMode?: boolean) {
     // scrobble
     await this.client.get("scrobble", { id: trackId, submission: true });
     return this.response(null);
  }

  async getLatestHistory(userId: number) {
      // Subsonic doesn't have "latest single history item" easily.
      return this.response(null);
  }

  async addAlbumToHistory(albumId: number, userId: number) {
     return this.response(null);
  }

  async getAlbumHistory(userId: number, loadCount: number, pageSize: number, type?: string) {
     return this.response({
         pageSize, loadCount, list: [], total: 0, hasMore: false
     });
  }

  async toggleLike(trackId: number, userId: number) {
      await this.client.get("star", { id: trackId });
      return this.response(null);
  }

  async toggleUnLike(trackId: number, userId: number) {
      await this.client.get("unstar", { id: trackId });
      return this.response(null);
  }

  async toggleAlbumLike(albumId: number, userId: number) {
      await this.client.get("star", { albumId: albumId });
      return this.response(null);
  }

  async unlikeAlbum(albumId: number, userId: number) {
      await this.client.get("unstar", { albumId: albumId });
      return this.response(null);
  }

  async getFavoriteAlbums(userId: number, loadCount: number, pageSize: number, type?: string) {
     const res = await this.client.get<{starred: { album: SubsonicAlbum[] } }>("getStarred");
     const albums = (res.starred?.album || []).map(a => mapSubsonicAlbumToAlbum(a, (id) => this.client.getCoverUrl(id)));
     return this.response({
         pageSize, list: albums, total: albums.length, hasMore: false, loadCount: albums.length
     });
  }

  async getFavoriteTracks(userId: number, loadCount: number, pageSize: number, type?: string) {
    const res = await this.client.get<{starred: { song: SubsonicChild[] }}>("getStarred");
    const tracks = (res.starred?.song || []).map(s => mapSubsonicSongToTrack(s, (id) => this.client.getCoverUrl(id)));
    return this.response({
        pageSize, list: tracks, total: tracks.length, hasMore: false, loadCount: tracks.length
    });
  }

  async getTrackHistory(userId: number, loadCount: number, pageSize: number, type?: string) {
     // getNowPlaying? or we can't get history really?
     // Actually there is no simple "User History" in standard subsonic without extensions maybe?
     // There is "getNowPlaying".
     return this.response({
         pageSize, list: [], total: 0, hasMore: false, loadCount: 0
     });
  }

  async getUserList() {
    const res = await this.client.get<{users: { user: any[] }}>("getUsers");
    return this.response(res.users?.user || []);
  }
}

export class SubsonicAuthAdapter implements IAuthAdapter {
    constructor(private client: SubsonicClient) {}
    
    private response<T>(data: T): ISuccessResponse<T> {
        return {
            code: 200,
            message: "success",
            data
        };
    }

    async login(user: Partial<User> & { deviceName?: string }) {
       const { deviceName } = user;
       // We assume "login" in Subsonic context means "ping settings are valid".
       // The actual login happens by configuring the client.
       // So this might just be a ping.
       const ping = await this.client.get<{ status: string, version: string }>("ping");
       if (!ping) throw new Error("Connection failed");
       
       // Try to get real user info if username is provided in config
       // Note: Subsonic getUser requires username, which we have in config
       try {
         const userRes = await this.client.get<{ user: { username: string, email?: string, adminRole?: boolean } }>("getUser", { username: (user as any).username || this.client.config.username });
         return this.response({
             id: 1, // Subsonic doesn't really allow numeric ID retrieval for users easily, use dummy
             username: userRes.user.username,
             email: userRes.user.email,
             is_admin: userRes.user.adminRole || false,
             token: "subsonic-session-token", // Dummy, auth is via config
             device: { id: 1, name: deviceName || "Subsonic", userId: 1, isOnline: true, createdAt: new Date(), updatedAt: new Date() }
         });
       } catch (e) {
         // Fallback if getUser fails (e.g. permissions)
           return this.response({
             id: 1,
             username: this.client.config.username,
             is_admin: false,
             token: "subsonic-session-token", 
             device: { id: 1, name: deviceName || "Subsonic Device", userId: 1, isOnline: true, createdAt: new Date(), updatedAt: new Date() }
         });
       }
    }

    async register(user: Partial<User> & { deviceName?: string }): Promise<ISuccessResponse<any>> {
       throw new Error("Register not supported in Subsonic");
    }

    async check() {
        try {
            await this.client.get("ping");
            return this.response(true);
        } catch {
            return this.response(false);
        }
    }

    async hello() {
        return this.response("Hello from Subsonic Adapter");
    }
}
