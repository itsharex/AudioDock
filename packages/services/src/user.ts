import { getAdapter } from "./adapter/manager";
  
  export const addToHistory = (trackId: number, userId: number, progress: number = 0, deviceName?: string, deviceId?: number, isSyncMode?: boolean) => {
    return getAdapter().user.addToHistory(trackId, userId, progress, deviceName, deviceId, isSyncMode);
  };
  
  export const getLatestHistory = (userId: number) => {
    return getAdapter().user.getLatestHistory(userId);
  };
  
  export const addAlbumToHistory = (albumId: number, userId: number) => {
    return getAdapter().user.addAlbumToHistory(albumId, userId);
  };
  
  export const getAlbumHistory = (userId: number, loadCount: number, pageSize: number, type?: string) => {
    return getAdapter().user.getAlbumHistory(userId, loadCount, pageSize, type);
  };
  
  export const toggleLike = (trackId: number, userId: number) => {
    return getAdapter().user.toggleLike(trackId, userId);
  };
  
  export const toggleUnLike = (trackId: number, userId: number) => {
    return getAdapter().user.toggleUnLike(trackId, userId);
  };
  
  export const toggleAlbumLike = (albumId: number, userId: number) => {
    return getAdapter().user.toggleAlbumLike(albumId, userId);
  };
  
  export const unlikeAlbum = (albumId: number, userId: number) => {
    return getAdapter().user.unlikeAlbum(albumId, userId);
  };
  
  export const getFavoriteAlbums = (userId: number, loadCount: number, pageSize: number, type?: string) => {
    return getAdapter().user.getFavoriteAlbums(userId, loadCount, pageSize, type);
  };
  
  export const getFavoriteTracks = (userId: number, loadCount: number, pageSize: number, type?: string) => {
    return getAdapter().user.getFavoriteTracks(userId, loadCount, pageSize, type);
  };
  
  export const getTrackHistory = (userId: number, loadCount: number, pageSize: number, type?: string) => {
    return getAdapter().user.getTrackHistory(userId, loadCount, pageSize, type);
  };
  
  export const getUserList = () => {
    return getAdapter().user.getUserList();
  };
