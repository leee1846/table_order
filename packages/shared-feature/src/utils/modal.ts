import {
  useModalStore,
  type ModalConfig,
  type ModalSize,
} from '../stores';

type OpenModalParams = Omit<ModalConfig, 'id'>;

/**
 * 모달 사이즈에 따른 너비를 반환하는 함수
 * @param size - 모달 사이즈
 * @returns 사이즈에 해당하는 너비 (px 단위)
 */
export const getModalWidth = (size?: ModalSize): string => {
  const sizeMap: Record<ModalSize, string> = {
    tiny: '335px',
    xsmall: '440px',
    small: '480px',
    medium: '560px',
    large: '640px',
    xlarge: '1016px',
    '2xlarge': '1140px',
  };

  return size ? sizeMap[size] : 'auto';
};

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
