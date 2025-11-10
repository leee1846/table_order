import { useModalStore, type ModalConfig } from '../stores';
import { getModalWidth } from '@repo/ui/utils';

type OpenModalParams = Omit<ModalConfig, 'id'>;

// getModalWidth를 re-export하여 기존 코드와의 호환성 유지
export { getModalWidth };

/**
 * Confirm Modal을 열기 위한 함수
 * @param params - 모달 설정
 * @returns 모달 ID
 */
export const openConfirmModal = (
  params: Omit<OpenModalParams, 'type'>
): string => {
  return useModalStore.getState().openModal({
    ...params,
    type: 'confirm',
  });
};

/**
 * Dual Action Modal을 열기 위한 함수
 * @param params - 모달 설정
 * @returns 모달 ID
 */
export const openDualActionModal = (
  params: Omit<OpenModalParams, 'type'>
): string => {
  return useModalStore.getState().openModal({
    ...params,
    type: 'dualAction',
  });
};

/**
 * Long Content Modal을 열기 위한 함수
 * @param params - 모달 설정
 * @returns 모달 ID
 */
export const openLongContentModal = (
  params: Omit<OpenModalParams, 'type'>
): string => {
  return useModalStore.getState().openModal({
    ...params,
    type: 'longContent',
  });
};

/**
 * 특정 모달을 닫기 위한 함수
 * @param id - 모달 ID
 */
export const closeModal = (id: string): void => {
  useModalStore.getState().closeModal(id);
};

/**
 * 모든 모달을 닫기 위한 함수
 */
export const closeAllModals = (): void => {
  useModalStore.getState().closeAllModals();
};
