import { getAdapter } from "./adapter/manager";
import type {
    Artist
} from "./models";
  
  export const getArtistList = (
    pageSize: number,
    loadCount: number,
    type?: string
  ) => {
    return getAdapter().artist.getArtistList(pageSize, loadCount, type);
  };
  
  export const getArtistTableList = (params: {
    pageSize: number;
    current: number;
  }) => {
    return getAdapter().artist.getArtistTableList(params);
  };
  
  export const loadMoreArtist = (params: {
    pageSize: number;
    loadCount: number;
  }) => {
    return getAdapter().artist.loadMoreArtist(params);
  };
  
  export const createArtist = (data: Omit<Artist, "id">) => {
    return getAdapter().artist.createArtist(data);
  };
  
  export const updateArtist = (id: number, data: Partial<Artist>) => {
    return getAdapter().artist.updateArtist(id, data);
  };
  
  export const deleteArtist = (id: number) => {
    return getAdapter().artist.deleteArtist(id);
  };
  
  export const batchCreateArtists = (data: Omit<Artist, "id">[]) => {
    return getAdapter().artist.batchCreateArtists(data);
  };
  
  export const batchDeleteArtists = (ids: number[]) => {
    return getAdapter().artist.batchDeleteArtists(ids);
  };
  
  export const getArtistById = (id: number) => {
    return getAdapter().artist.getArtistById(id);
  };
  
  export const getLatestArtists = (type: string, random?: boolean, pageSize?: number) => {
    return getAdapter().artist.getLatestArtists(type, random, pageSize);
  };
