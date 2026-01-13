export interface NoticeFormData {
  id?: number; // 공지사항 ID
  boardType: string; // 유형
  title: string; // 제목
  content: string; // 내용
  createdAt?: string; // 생성일자
  updatedAt?: string; // 수정일자
}

export const DEFAULT_NOTICE_DATA: NoticeFormData = {
  boardType: '',
  title: '',
  content: '',
};

// 유형 옵션 (boardType)
export const BOARD_TYPE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'GENERAL', label: '일반' },
  { value: 'EMERGENCY', label: '긴급' },
];

/**
 * boardType 값을 한글 라벨로 변환합니다.
 * @param boardType - boardType 값
 * @returns 한글 라벨 또는 원본 값
 */
export const getBoardTypeLabel = (boardType: string | null): string => {
  if (!boardType) {
    return '-';
  }
  const option = BOARD_TYPE_OPTIONS.find((opt) => opt.value === boardType);
  return option ? option.label : boardType;
};
