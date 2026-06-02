import type { TAppType } from '@repo/api/types';

export interface AppHistoriesFormData {
  id?: number; // 앱 히스토리 ID
  type: TAppType;
  title: string; // 제목
  deployDateTime: string; // 배포일시
  version: string; // 버전
  content: string; // 내용
  createdAt?: string; // 최초 등록일시
  updatedAt?: string; // 마지막 수정일시
  downloadPath?: string; // 업로드된 앱 파일 경로 (상세 조회용)
}

export const DEFAULT_APP_HISTORIES_DATA: AppHistoriesFormData = {
  type: '',
  title: '',
  deployDateTime: '',
  version: '',
  content: '',
};
