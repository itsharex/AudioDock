import type {
    Album,
    ILoadMoreData,
    ISuccessResponse,
    ITableData,
} from "../../models";
import request from "../../request";
import { IAlbumAdapter } from "../interface";

export class NativeAlbumAdapter implements IAlbumAdapter {
  getAlbumList() {
    return request.get<any, ISuccessResponse<Album[]>>("/album/list");
  }

  getAlbumTableList(params: {
    pageSize: number;
    current: number;
  }) {
    return request.get<any, ISuccessResponse<ITableData<Album[]>>>(
      "/album/table-list",
      { params }
    );
  }

  loadMoreAlbum(params: {
    pageSize: number;
    loadCount: number;
    type?: string;
  }) {
    return request.get<any, ISuccessResponse<ILoadMoreData<Album>>>(
      "/album/load-more",
      { params }
    );
  }

  createAlbum(data: Omit<Album, "id">) {
    return request.post<any, ISuccessResponse<Album>>("/album", data);
  }

  updateAlbum(id: number, data: Partial<Album>) {
    return request.put<any, ISuccessResponse<Album>>(`/album/${id}`, data);
  }

  deleteAlbum(id: number) {
    return request.delete<any, ISuccessResponse<boolean>>(`/album/${id}`);
  }

  batchCreateAlbums(data: Omit<Album, "id">[]) {
    return request.post<any, ISuccessResponse<boolean>>(
      "/album/batch-create",
      data
    );
  }

  batchDeleteAlbums(ids: number[]) {
    return request.delete<any, ISuccessResponse<boolean>>(
      "/album/batch-delete",
      { data: ids }
    );
  }

  getRecommendedAlbums(type?: string, random?: boolean, pageSize?: number) {
    return request.get<any, ISuccessResponse<Album[]>>("/album/recommend", {
      params: { type, random, pageSize },
    });
  }

  getRecentAlbums(type?: string, random?: boolean, pageSize?: number) {
    return request.get<any, ISuccessResponse<Album[]>>("/album/latest", {
      params: { type, random, pageSize },
    });
  }

  getAlbumById(id: number) {
    return request.get<any, ISuccessResponse<Album>>(`/album/${id}`);
  }

  getAlbumTracks(
    id: number,
    pageSize: number,
    skip: number,
    sort: "asc" | "desc" = "asc",
    keyword?: string,
    userId?: number,
  ) {
    return request.get<any, ISuccessResponse<{ list: any[]; total: number }>>(
      `/album/${id}/tracks`,
      {
        params: { pageSize, skip, sort, keyword, userId },
      }
    );
  }

  getAlbumsByArtist(artist: string) {
    return request.get<any, ISuccessResponse<Album[]>>(`/album/artist/${artist}`);
  }

  getCollaborativeAlbumsByArtist(artist: string) {
    return request.get<any, ISuccessResponse<Album[]>>(`/album/collaborative/${artist}`);
  }
}
