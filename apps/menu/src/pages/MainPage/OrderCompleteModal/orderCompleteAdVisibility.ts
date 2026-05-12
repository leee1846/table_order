import type { IGetMenuAdFile } from '@repo/api/types';

/** sortOrder 기준 FULL이 SIDE보다 먼저(또는 동등)면 전면 광고만 표시 */
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
