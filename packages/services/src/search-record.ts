import type { ISuccessResponse } from "./models";
import request from "./request";

export const addSearchRecord = (keyword: string) => {
  return request.post<any, ISuccessResponse<any>>("/search-record", { keyword });
};

export const getSearchHistory = () => {
  return request.get<any, ISuccessResponse<string[]>>("/search-record/history");
};

export const getHotSearches = () => {
  return request.get<any, ISuccessResponse<{ keyword: string; count: number }[]>>(
    "/search-record/hot"
  );
};

export const clearSearchHistory = () => {
  return request.delete<any, ISuccessResponse<any>>("/search-record/history");
};
