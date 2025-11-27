/**
 * 스토어의 기본 상태 타입
 * 모든 스토어는 이 인터페이스를 확장하여 사용합니다.
 *
 * @template T - 저장할 데이터의 타입
 */
export interface IBaseStoreState<T> {
  /** 저장된 데이터 */
  data: T | null;
  /** 데이터 로딩 상태 */
  isLoading: boolean;
  /** 에러 정보 */
  error: Error | null;
  /** 마지막 업데이트 시간 */
  lastUpdated: number | null;
}

/**
 * 스토어의 액션 타입
 * 모든 스토어는 이 인터페이스를 확장하여 사용합니다.
 *
 * @template T - 저장할 데이터의 타입
 */
export interface IBaseStoreActions<T> {
  /** 데이터 설정 (세션 스토리지에도 저장) */
  setData: (data: T) => void;
  /** 데이터 초기화 (세션 스토리지에서도 삭제) */
  clearData: () => void;
  /** 로딩 상태 설정 */
  setLoading: (isLoading: boolean) => void;
  /** 에러 설정 */
  setError: (error: Error | null) => void;
  /** 세션 스토리지에서 데이터 불러오기 */
  loadFromStorage: () => void;
}

/**
 * 스토어 전체 타입 (상태 + 액션)
 */
export type IBaseStore<T> = IBaseStoreState<T> & IBaseStoreActions<T>;

/**
 * 스토어 초기 상태
 */
export const createInitialState = <T>(): IBaseStoreState<T> => ({
  data: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
});
