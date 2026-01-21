import { ILoadMoreData, ISuccessResponse, User } from "../models";

export interface IUserAdapter {
  addToHistory(trackId: number, userId: number, progress?: number, deviceName?: string, deviceId?: number, isSyncMode?: boolean): Promise<ISuccessResponse<any>>;
  getLatestHistory(userId: number): Promise<ISuccessResponse<any>>;
  addAlbumToHistory(albumId: number, userId: number): Promise<ISuccessResponse<any>>;
  getAlbumHistory(userId: number, loadCount: number, pageSize: number, type?: string): Promise<ISuccessResponse<ILoadMoreData<any>>>;
  toggleLike(trackId: number, userId: number): Promise<ISuccessResponse<any>>;
  toggleUnLike(trackId: number, userId: number): Promise<ISuccessResponse<any>>;
  toggleAlbumLike(albumId: number, userId: number): Promise<ISuccessResponse<any>>;
  unlikeAlbum(albumId: number, userId: number): Promise<ISuccessResponse<any>>;
  getFavoriteAlbums(userId: number, loadCount: number, pageSize: number, type?: string): Promise<ISuccessResponse<ILoadMoreData<any>>>;
  getFavoriteTracks(userId: number, loadCount: number, pageSize: number, type?: string): Promise<ISuccessResponse<ILoadMoreData<any>>>;
  getTrackHistory(userId: number, loadCount: number, pageSize: number, type?: string): Promise<ISuccessResponse<ILoadMoreData<any>>>;
  getUserList(): Promise<ISuccessResponse<any[]>>;
}

export interface IAuthAdapter {
    login(user: Partial<User> & { deviceName?: string }): Promise<ISuccessResponse<any>>;
    register(user: Partial<User> & { deviceName?: string }): Promise<ISuccessResponse<any>>;
    check(): Promise<ISuccessResponse<boolean>>;
    hello(): Promise<ISuccessResponse<string>>;
}
