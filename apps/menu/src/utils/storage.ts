/**
 * Storage 유틸리티
 * localStorage와 sessionStorage 중 선택하여 사용 가능
 */

type TStorage = 'local' | 'session';

/**
 * 스토리지 타입에 따라 적절한 Storage 객체 반환
 */
const getStorage = (type: TStorage): Storage => {
  return type === 'local' ? localStorage : sessionStorage;
};

/**
 * 스토리지 인터페이스 생성
 */
const createStorageInterface = (type: TStorage) => ({
  /**
   * 스토리지에 데이터 저장
   */
  save: <T>(key: string, data: T): boolean => {
    try {
      getStorage(type).setItem(key, JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  },

  /**
   * 스토리지에서 데이터 로드
   */
  load: <T>(key: string): T | null => {
    try {
      const item = getStorage(type).getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  /**
   * 스토리지에서 데이터 삭제
   */
  remove: (key: string): void => {
    try {
      getStorage(type).removeItem(key);
    } catch {
      // ignore
    }
  },

  /**
   * 전체 스토리지 초기화
   */
  clear: (): void => {
    try {
      getStorage(type).clear();
    } catch {
      // ignore
    }
  },
});

const storage = {
  /**
   * localStorage 사용
   * 예: storage.local.save('key', data)
   */
  local: createStorageInterface('local'),

  /**
   * sessionStorage 사용
   * 예: storage.session.save('key', data)
   */
  session: createStorageInterface('session'),
};

export default storage;
