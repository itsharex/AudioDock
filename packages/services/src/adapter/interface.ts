import { Album, Artist, ILoadMoreData, ISuccessResponse, ITableData, Track } from "../models";

export interface ITrackAdapter {
  getTrackList(): Promise<ISuccessResponse<Track[]>>;
  getTrackTableList(params: { pageSize: number; current: number }): Promise<ISuccessResponse<ITableData<Track[]>>>;
  loadMoreTrack(params: { pageSize: number; loadCount: number }): Promise<ISuccessResponse<ILoadMoreData<Track>>>;
  createTrack(data: Omit<Track, "id">): Promise<ISuccessResponse<Track>>;
  updateTrack(id: number, data: Partial<Track>): Promise<ISuccessResponse<Track>>;
  deleteTrack(id: number, deleteAlbum?: boolean): Promise<ISuccessResponse<boolean>>;
  getDeletionImpact(id: number): Promise<ISuccessResponse<{ isLastTrackInAlbum: boolean; albumName: string | null }>>;
  batchCreateTracks(data: Omit<Track, "id">[]): Promise<ISuccessResponse<boolean>>;
  batchDeleteTracks(ids: number[]): Promise<ISuccessResponse<boolean>>;
  getLatestTracks(type?: string, random?: boolean, pageSize?: number): Promise<ISuccessResponse<Track[]>>;
  getTracksByArtist(artist: string): Promise<ISuccessResponse<Track[]>>;
}

export interface IAlbumAdapter {
  getAlbumList(): Promise<ISuccessResponse<Album[]>>;
  getAlbumTableList(params: { pageSize: number; current: number }): Promise<ISuccessResponse<ITableData<Album[]>>>;
  loadMoreAlbum(params: { pageSize: number; loadCount: number; type?: string }): Promise<ISuccessResponse<ILoadMoreData<Album>>>;
  createAlbum(data: Omit<Album, "id">): Promise<ISuccessResponse<Album>>;
  updateAlbum(id: number, data: Partial<Album>): Promise<ISuccessResponse<Album>>;
  deleteAlbum(id: number): Promise<ISuccessResponse<boolean>>;
  batchCreateAlbums(data: Omit<Album, "id">[]): Promise<ISuccessResponse<boolean>>;
  batchDeleteAlbums(ids: number[]): Promise<ISuccessResponse<boolean>>;
  getRecommendedAlbums(type?: string, random?: boolean, pageSize?: number): Promise<ISuccessResponse<Album[]>>;
  getRecentAlbums(type?: string, random?: boolean, pageSize?: number): Promise<ISuccessResponse<Album[]>>;
  getAlbumById(id: number): Promise<ISuccessResponse<Album>>;
  getAlbumTracks(id: number, pageSize: number, skip: number, sort?: "asc" | "desc", keyword?: string, userId?: number): Promise<ISuccessResponse<{ list: any[]; total: number }>>;
  getAlbumsByArtist(artist: string): Promise<ISuccessResponse<Album[]>>;
  getCollaborativeAlbumsByArtist(artist: string): Promise<ISuccessResponse<Album[]>>;
}

export interface IArtistAdapter {
  getArtistList(pageSize: number, loadCount: number, type?: string): Promise<ISuccessResponse<ILoadMoreData<Artist>>>;
  getArtistTableList(params: { pageSize: number; current: number }): Promise<ISuccessResponse<ITableData<Artist[]>>>;
  loadMoreArtist(params: { pageSize: number; loadCount: number }): Promise<ISuccessResponse<ILoadMoreData<Artist>>>;
  createArtist(data: Omit<Artist, "id">): Promise<ISuccessResponse<Artist>>;
  updateArtist(id: number, data: Partial<Artist>): Promise<ISuccessResponse<Artist>>;
  deleteArtist(id: number): Promise<ISuccessResponse<boolean>>;
  batchCreateArtists(data: Omit<Artist, "id">[]): Promise<ISuccessResponse<boolean>>;
  batchDeleteArtists(ids: number[]): Promise<ISuccessResponse<boolean>>;
  getArtistById(id: number): Promise<ISuccessResponse<Artist>>;
  getLatestArtists(type: string, random?: boolean, pageSize?: number): Promise<ISuccessResponse<Artist[]>>;
}

import { IAuthAdapter, IUserAdapter } from "./interface-user-auth";

// ... existing code ...

export interface IMusicAdapter {
  track: ITrackAdapter;
  album: IAlbumAdapter;
  artist: IArtistAdapter;
  user: IUserAdapter;
  auth: IAuthAdapter;
}

