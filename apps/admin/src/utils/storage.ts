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
      localStorage.setItem(key, JSON.stringify(data));
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
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  /**
   * 스토리지에서 데이터 삭제
   */

  //TODO 결제 후 초기화 필요 (손님이 떠난 후)
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

export default storage;
