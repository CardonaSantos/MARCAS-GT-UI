export interface PageMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PageResult<T> {
  data: T[];
  meta: PageMeta;
}
