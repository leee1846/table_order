import type { IGetMenuAdFile } from '@repo/api/types';

/** store에서 ORDER_COMP 슬롯이 FULL로 결정된 경우 전면 광고 표시 */
export function shouldShowOrderCompleteFullscreenAd(
  orderCompleteFullFiles: readonly IGetMenuAdFile[]
): boolean {
  return orderCompleteFullFiles.length > 0;
}

/** 전면이 아니고 사이드 광고가 있을 때(좌측 half 광고 영역) */
export function shouldShowOrderCompleteHalfAd(
  orderCompleteFullFiles: readonly IGetMenuAdFile[],
  orderCompleteSideFiles: readonly IGetMenuAdFile[]
): boolean {
  return (
    orderCompleteFullFiles.length === 0 &&
    orderCompleteSideFiles.length > 0
  );
}

/** 전면 광고가 아닐 때(반쪽 광고·기본 완료 화면) 카운트다운 표시·자동 닫기 */
export function shouldShowOrderCompleteCountdown(
  orderCompleteFullFiles: readonly IGetMenuAdFile[]
): boolean {
  return !shouldShowOrderCompleteFullscreenAd(orderCompleteFullFiles);
}
