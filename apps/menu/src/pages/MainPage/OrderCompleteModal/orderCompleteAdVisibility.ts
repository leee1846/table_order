import type { IGetMenuAdFile } from '@repo/api/types';

/**
 * 전면 광고 노출 여부.
 * useAdStore.groupAdFiles에서 FULL/SIDE 중 array에 먼저 등장하는 유형만 채워주므로,
 * FULL이 채워져 있으면(=array에서 FULL이 먼저) 전면 광고를 표시한다.
 */
export function shouldShowOrderCompleteFullscreenAd(
  orderCompleteFullFiles: readonly IGetMenuAdFile[],
  orderCompleteSideFiles: readonly IGetMenuAdFile[]
): boolean {
  const firstFull = orderCompleteFullFiles[0];
  const firstSide = orderCompleteSideFiles[0];
  return (
    !!firstFull &&
    (!firstSide || firstFull.sortOrder <= firstSide.sortOrder)
  );
}

/** 전면이 아니고 사이드 광고가 있을 때(좌측 half 광고 영역) */
export function shouldShowOrderCompleteHalfAd(
  orderCompleteFullFiles: readonly IGetMenuAdFile[],
  orderCompleteSideFiles: readonly IGetMenuAdFile[]
): boolean {
  return (
    !shouldShowOrderCompleteFullscreenAd(
      orderCompleteFullFiles,
      orderCompleteSideFiles
    ) && orderCompleteSideFiles[0] !== undefined
  );
}

/** 전면 광고가 아닐 때(반쪽 광고·기본 완료 화면) 카운트다운 표시·자동 닫기 */
export function shouldShowOrderCompleteCountdown(
  orderCompleteFullFiles: readonly IGetMenuAdFile[],
  orderCompleteSideFiles: readonly IGetMenuAdFile[]
): boolean {
  return !shouldShowOrderCompleteFullscreenAd(
    orderCompleteFullFiles,
    orderCompleteSideFiles
  );
}
