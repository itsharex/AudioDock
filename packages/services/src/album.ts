import { getAdapter } from "./adapter/manager";
import type {
    Album
} from "./models";
  
  export const getAlbumList = () => {
    return getAdapter().album.getAlbumList();
  };
  
  export const getAlbumTableList = (params: {
    pageSize: number;
    current: number;
  }) => {
    return getAdapter().album.getAlbumTableList(params);
  };
  
  export const loadMoreAlbum = (params: {
    pageSize: number;
    loadCount: number;
    type?: string;
  }) => {
    return getAdapter().album.loadMoreAlbum(params);
  };
  
  export const createAlbum = (data: Omit<Album, "id">) => {
    return getAdapter().album.createAlbum(data);
  };
  
  export const updateAlbum = (id: number, data: Partial<Album>) => {
    return getAdapter().album.updateAlbum(id, data);
  };
  
  export const deleteAlbum = (id: number) => {
    return getAdapter().album.deleteAlbum(id);
  };
  
  export const batchCreateAlbums = (data: Omit<Album, "id">[]) => {
    return getAdapter().album.batchCreateAlbums(data);
  };
  
  export const batchDeleteAlbums = (ids: number[]) => {
    return getAdapter().album.batchDeleteAlbums(ids);
  };
  
  // Get recommended albums (8 random unlistened albums)
  export const getRecommendedAlbums = (type?: string, random?: boolean, pageSize?: number) => {
    return getAdapter().album.getRecommendedAlbums(type, random, pageSize);
  };
  
  // Get recent albums (8 latest albums)
  export const getRecentAlbums = (type?: string, random?: boolean, pageSize?: number) => {
    return getAdapter().album.getRecentAlbums(type, random, pageSize);
  };
  
  // Get album details by ID
  export const getAlbumById = (id: number) => {
    return getAdapter().album.getAlbumById(id);
  };
  
  // Get album tracks with pagination
  export const getAlbumTracks = (
    id: number,
    pageSize: number,
    skip: number,
    sort: "asc" | "desc" = "asc",
    keyword?: string,
    userId?: number,
  ) => {
    return getAdapter().album.getAlbumTracks(id, pageSize, skip, sort, keyword, userId);
  };
  
  export const getAlbumsByArtist = (artist: string) => {
    return getAdapter().album.getAlbumsByArtist(artist);
  };
  
  export const getCollaborativeAlbumsByArtist = (artist: string) => {
    return getAdapter().album.getCollaborativeAlbumsByArtist(artist);
  };
