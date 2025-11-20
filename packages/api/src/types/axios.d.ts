import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    ignoreGlobalErrors?: number[];
  }
}


