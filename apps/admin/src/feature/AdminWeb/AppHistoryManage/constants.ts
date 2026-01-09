export interface AppHistoryFormData {
  id?: number; // 앱 히스토리 ID
  type: string; // 구분: 'MENU' | 'POS' | 'AGENT'
  title: string; // 제목
  deployDateTime: string; // 배포일시
  version: string; // 버전
  content: string; // 내용
  createdAt?: string; // 최초 등록일시
  updatedAt?: string; // 마지막 수정일시
}

export const DEFAULT_APP_HISTORY_DATA: AppHistoryFormData = {
  type: '',
  title: '',
  deployDateTime: '',
  version: '',
  content: '',
};
