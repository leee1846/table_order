import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    ignoreGlobalErrors?: number[];
    /** When true, privateApi skips handleApiErrorDialog (still handles 401). */
    skipGlobalErrorHandling?: boolean;
  }
}
