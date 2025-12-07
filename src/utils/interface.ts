import { RequestMethods } from './enums';

export interface FetchParams {
  url: string;
  method: RequestMethods;
  body?: any;
  headers?: Record<string, string>;
  cache?: RequestCache;
}