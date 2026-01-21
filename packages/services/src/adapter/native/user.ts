import { ILoadMoreData, ISuccessResponse } from "../../models";
import request from "../../request";
import { IUserAdapter } from "../interface-user-auth";

export class NativeUserAdapter implements IUserAdapter {
  addToHistory(trackId: number, userId: number, progress: number = 0, deviceName?: string, deviceId?: number, isSyncMode?: boolean) {
    return request.post<any, ISuccessResponse<any>>("/user-track-histories", {
      trackId,
      userId,
      progress,
      deviceName,
      deviceId,
      isSyncMode,
    });
  }

  getLatestHistory(userId: number) {
      return request.get<any, ISuccessResponse<any>>("/user-track-histories/latest", {
          params: { userId }
      });
  }

  addAlbumToHistory(albumId: number, userId: number) {
    return request.post<any, ISuccessResponse<any>>("/user-album-histories", {
      albumId,
      userId,
    });
  }

  getAlbumHistory(userId: number, loadCount: number, pageSize: number, type?: string) {
    return request.get<any, ISuccessResponse<ILoadMoreData<any>>>("/user-album-histories/load-more", {
      params: { pageSize, loadCount, userId, type },
    });
  }

  toggleLike(trackId: number, userId: number) {
    return request.post<any, ISuccessResponse<any>>("/user-track-likes/create", {
      trackId,
      userId,
    });
  }

  toggleUnLike(trackId: number, userId: number) {
    return request.delete<any, ISuccessResponse<any>>("/user-track-likes/unlike", {
      params: { trackId, userId },
    });
  }

  toggleAlbumLike(albumId: number, userId: number) {
    return request.post<any, ISuccessResponse<any>>("/user-album-likes", {
      albumId,
      userId,
    });
  }

  unlikeAlbum(albumId: number, userId: number) {
    return request.delete<any, ISuccessResponse<any>>("/user-album-likes/unlike", {
      params: { albumId, userId },
    });
  }

  getFavoriteAlbums(userId: number, loadCount: number, pageSize: number, type?: string) {
    return request.get<any, ISuccessResponse<ILoadMoreData<any>>>("/user-album-likes/load-more", {
      params: { pageSize, loadCount, userId, type },
    });
  }

  getFavoriteTracks(userId: number, loadCount: number, pageSize: number, type?: string) {
    return request.get<any, ISuccessResponse<ILoadMoreData<any>>>("/user-track-likes/load-more", {
      params: { pageSize, loadCount: loadCount, userId, lastId: loadCount, type },
    });
  }

  getTrackHistory(userId: number, loadCount: number, pageSize: number, type?: string) {
    return request.get<any, ISuccessResponse<ILoadMoreData<any>>>("/user-track-histories/load-more", {
      params: { pageSize, loadCount: loadCount, userId, type },
    });
  }

  getUserList() {
    return request.get<any, ISuccessResponse<any[]>>("/user/list");
  }
}
