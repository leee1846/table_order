import { DialogConfig, useDialogStore } from '../stores';

type OpenDialogParams = Omit<DialogConfig, 'id'>;

/**
 * 확인 버튼만 있는 Confirm 다이얼로그를 열기 위한 함수
 *
 * @param params - 다이얼로그 설정 객체
 * @param params.title - 다이얼로그 제목 (선택사항)
 * @param params.content - 다이얼로그 내용 (ReactNode, 필수)
 * @param params.confirmText - 확인 버튼 텍스트 (기본값: '확인')
 * @param params.onConfirm - 확인 버튼 클릭 시 실행될 콜백 함수 (선택사항)
 * @param params.position - 다이얼로그 위치 ('center' | 'top', 기본값: 'center')
 * @param params.size - 다이얼로그 크기 ('tiny' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge', 선택사항)
 * @returns 생성된 다이얼로그의 고유 ID (닫을 때 사용)
 *
 * @example
 * ```tsx
 * import { openConfirmDialog } from '@repo/feature/utils';
 *
 * // 기본 사용법
 * const dialogId = openConfirmDialog({
 *   title: '알림',
 *   content: '정말 삭제하시겠습니까?',
 *   confirmText: '삭제',
 *   onConfirm: () => {
 *     console.log('삭제 확인됨');
 *   },
 * });
 *
 * // 간단한 알림
 * openConfirmDialog({
 *   content: '저장되었습니다.',
 * });
 * ```
 */
export const openConfirmDialog = (
  params: Omit<OpenDialogParams, 'type'>
): string => {
  return useDialogStore.getState().openDialog({
    ...params,
    type: 'confirm',
  });
};

/**
 * 확인/취소 두 개의 버튼이 있는 Dual Action 다이얼로그를 열기 위한 함수
 *
 * @param params - 다이얼로그 설정 객체
 * @param params.title - 다이얼로그 제목 (선택사항)
 * @param params.content - 다이얼로그 내용 (ReactNode, 필수)
 * @param params.primaryText - 확인 버튼(주 액션) 텍스트 (기본값: '주 액션')
 * @param params.secondaryText - 취소 버튼(보조 액션) 텍스트 (기본값: '보조 액션')
 * @param params.onConfirm - 확인 버튼 클릭 시 실행될 콜백 함수 (선택사항)
 * @param params.onCancel - 취소 버튼 클릭 시 실행될 콜백 함수 (선택사항)
 * @param params.position - 다이얼로그 위치 ('center' | 'top', 기본값: 'center')
 * @param params.size - 다이얼로그 크기 ('tiny' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge', 선택사항)
 * @returns 생성된 다이얼로그의 고유 ID (닫을 때 사용)
 *
 * @example
 * ```tsx
 * import { openDualActionDialog } from '@repo/feature/utils';
 *
 * // 확인/취소 다이얼로그
 * const dialogId = openDualActionDialog({
 *   title: '삭제 확인',
 *   content: '이 항목을 정말 삭제하시겠습니까?',
 *   primaryText: '삭제',
 *   secondaryText: '취소',
 *   onConfirm: () => {
 *     console.log('삭제됨');
 *   },
 *   onCancel: () => {
 *     console.log('취소됨');
 *   },
 * });
 * ```
 */
export const openDualActionDialog = (
  params: Omit<OpenDialogParams, 'type'>
): string => {
  return useDialogStore.getState().openDialog({
    ...params,
    type: 'dualAction',
  });
};

/**
 * 긴 내용을 표시할 수 있는 Long Content 다이얼로그를 열기 위한 함수
 * 스크롤 가능한 콘텐츠 영역과 닫기 버튼이 포함되어 있습니다.
 *
 * @param params - 다이얼로그 설정 객체
 * @param params.title - 다이얼로그 제목 (선택사항)
 * @param params.content - 다이얼로그 내용 (ReactNode, 필수)
 * @param params.confirmText - 확인 버튼 텍스트 (기본값: '확인')
 * @param params.onConfirm - 확인 버튼 클릭 시 실행될 콜백 함수 (선택사항)
 * @param params.position - 다이얼로그 위치 ('center' | 'top', 기본값: 'center')
 * @param params.size - 다이얼로그 크기 ('tiny' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge', 선택사항)
 * @returns 생성된 다이얼로그의 고유 ID (닫을 때 사용)
 *
 * @example
 * ```tsx
 * import { openLongContentDialog } from '@repo/feature/utils';
 *
 * // 긴 내용 다이얼로그
 * const dialogId = openLongContentDialog({
 *   title: '약관 동의',
 *   content: (
 *     <div>
 *       <p>여기에 긴 내용이 들어갑니다...</p>
 *       {/* 스크롤 가능한 영역 *\/}
 *     </div>
 *   ),
 *   confirmText: '동의',
 *   onConfirm: () => {
 *     console.log('약관 동의됨');
 *   },
 *   size: 'large',
 * });
 * ```
 */
export const openLongContentDialog = (
  params: Omit<OpenDialogParams, 'type'>
): string => {
  return useDialogStore.getState().openDialog({
    ...params,
    type: 'longContent',
  });
};

/**
 * 특정 다이얼로그를 닫기 위한 함수
 *
 * @param id - 닫을 다이얼로그의 고유 ID (openConfirmDialog, openDualActionDialog, openLongContentDialog에서 반환된 값)
 *
 * @example
 * ```tsx
 * import { openConfirmDialog, closeDialog } from '@repo/feature/utils';
 *
 * const dialogId = openConfirmDialog({
 *   content: '다이얼로그 내용',
 * });
 *
 * // 나중에 특정 다이얼로그 닫기
 * closeDialog(dialogId);
 * ```
 */
export const closeDialog = (id: string): void => {
  useDialogStore.getState().closeDialog(id);
};

/**
 * 현재 열려있는 모든 다이얼로그를 닫기 위한 함수
 *
 * @example
 * ```tsx
 * import { closeAllDialogs } from '@repo/feature/utils';
 *
 * // 모든 다이얼로그 닫기
 * closeAllDialogs();
 * ```
 */
export const closeAllDialogs = (): void => {
  useDialogStore.getState().closeAllDialogs();
};
