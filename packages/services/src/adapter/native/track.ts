import type {
    ILoadMoreData,
    ISuccessResponse,
    ITableData,
    Track,
} from "../../models";
import request from "../../request";
import { ITrackAdapter } from "../interface";

export class NativeTrackAdapter implements ITrackAdapter {
  getTrackList() {
    return request.get<any, ISuccessResponse<Track[]>>("/track/list");
  }

  getTrackTableList(params: {
    pageSize: number;
    current: number;
  }) {
    return request.get<any, ISuccessResponse<ITableData<Track[]>>>(
      "/table-list",
      { params }
    );
  }

  loadMoreTrack(params: {
    pageSize: number;
    loadCount: number;
  }) {
    return request.get<any, ISuccessResponse<ILoadMoreData<Track>>>(
      "/load-more",
      { params }
    );
  }

  createTrack(data: Omit<Track, "id">) {
    return request.post<any, ISuccessResponse<Track>>("/track", data);
  }

  updateTrack(id: number, data: Partial<Track>) {
    return request.put<any, ISuccessResponse<Track>>(`/track/${id}`, data);
  }

  deleteTrack(id: number, deleteAlbum: boolean = false) {
    return request.delete<any, ISuccessResponse<boolean>>(`/track/${id}`, {
      params: { deleteAlbum },
    });
  }

  getDeletionImpact(id: number) {
    return request.get<
      any,
      ISuccessResponse<{ isLastTrackInAlbum: boolean; albumName: string | null }>
    >(`/track/${id}/deletion-impact`);
  }

  batchCreateTracks(data: Omit<Track, "id">[]) {
    return request.post<any, ISuccessResponse<boolean>>(
      "/track/batch-create",
      data
    );
  }

  batchDeleteTracks(ids: number[]) {
    return request.delete<any, ISuccessResponse<boolean>>(
      "/track/batch-delete",
      { data: ids }
    );
  }

  getLatestTracks(type?: string, random?: boolean, pageSize?: number) {
    return request.get<any, ISuccessResponse<Track[]>>("/track/latest", {
      params: { type, random, pageSize },
    });
  }

  getTracksByArtist(artist: string) {
    return request.get<any, ISuccessResponse<Track[]>>("/track/artist", {
      params: { artist },
    });
  }
}
