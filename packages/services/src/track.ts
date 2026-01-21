import { getAdapter } from "./adapter/manager";
import type {
    Track
} from "./models";
  
  export const getTrackList = () => {
    return getAdapter().track.getTrackList();
  };
  
  export const getTrackTableList = (params: {
    pageSize: number;
    current: number;
  }) => {
    return getAdapter().track.getTrackTableList(params);
  };
  
  export const loadMoreTrack = (params: {
    pageSize: number;
    loadCount: number;
  }) => {
    return getAdapter().track.loadMoreTrack(params);
  };
  
  export const createTrack = (data: Omit<Track, "id">) => {
    return getAdapter().track.createTrack(data);
  };
  
  export const updateTrack = (id: number, data: Partial<Track>) => {
    return getAdapter().track.updateTrack(id, data);
  };
  
  export const deleteTrack = (id: number, deleteAlbum: boolean = false) => {
    return getAdapter().track.deleteTrack(id, deleteAlbum);
  };
  
  export const getDeletionImpact = (id: number) => {
    return getAdapter().track.getDeletionImpact(id);
  };
  
  export const batchCreateTracks = (data: Omit<Track, "id">[]) => {
    return getAdapter().track.batchCreateTracks(data);
  };
  
  export const batchDeleteTracks = (ids: number[]) => {
    return getAdapter().track.batchDeleteTracks(ids);
  };
  
  export const getLatestTracks = (type?: string, random?: boolean, pageSize?: number) => {
    return getAdapter().track.getLatestTracks(type, random, pageSize);
  };
  
  export const getTracksByArtist = (artist: string) => {
    return getAdapter().track.getTracksByArtist(artist);
  };
