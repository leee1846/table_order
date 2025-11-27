/**
 * Storage 유틸리티
 * 현재는 세션 스토리지 사용, 추후 앱 스토리지로 변경 가능
 */

const storage = {
  /**
   * 스토리지에 데이터 저장
   */
  save: <T>(key: string, data: T): boolean => {
    try {
      sessionStorage.setItem(key, JSON.stringify(data));
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
      const item = sessionStorage.getItem(key);
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
      sessionStorage.removeItem(key);
    } catch {
      // ignore
    }
  },

  /**
   * 전체 스토리지 초기화
   */
  clear: (): void => {
    try {
      sessionStorage.clear();
    } catch {
      // ignore
    }
  },
};

export default storage;
