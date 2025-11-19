export interface IApiStatus {
  code: number;
  userMessage: string | null;
  debugMessage: string;
}

export interface IApiResponse<T> {
  status: IApiStatus;
  data: T;
}

export interface IApiError {
  status: IApiStatus;
  data: null;
}
