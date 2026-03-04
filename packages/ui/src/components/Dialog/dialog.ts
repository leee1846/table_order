/**
 * 모달 사이즈 타입
 */
export type DialogSize =
  | 'tiny'
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | '2xlarge';

/**
 * 모달 사이즈에 따른 너비를 반환하는 함수
 * @param size - 모달 사이즈
 * @returns 사이즈에 해당하는 너비 (px 단위)
 */
export const getDialogWidth = (size?: DialogSize): string => {
  const sizeMap: Record<DialogSize, string> = {
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
