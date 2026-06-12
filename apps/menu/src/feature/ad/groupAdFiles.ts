import type { IGetMenuAdFile, TGetMenuAdFilesAdType } from '@repo/api/types';

const STANDBY_TYPES: readonly TGetMenuAdFilesAdType[] = [
  'STANDBY_VIDEO',
  'STANDBY_IMAGE',
];

const TOP_BANNER_TYPES: readonly TGetMenuAdFilesAdType[] = ['TOP_BANNER_IMAGE'];

const ORDER_COMP_FULL_TYPES: readonly TGetMenuAdFilesAdType[] = [
  'ORDER_COMP_FULL_VIDEO',
  'ORDER_COMP_FULL_IMAGE',
];

const ORDER_COMP_SIDE_TYPES: readonly TGetMenuAdFilesAdType[] = [
  'ORDER_COMP_SIDE_IMAGE',
];

const isAdType = (
  adType: TGetMenuAdFilesAdType,
  types: readonly TGetMenuAdFilesAdType[]
): boolean => (types as string[]).includes(adType);

/** API 배열 순서를 유지하며 adType 필터 */
const filterByTypes = (
  files: readonly IGetMenuAdFile[],
  types: readonly TGetMenuAdFilesAdType[]
): IGetMenuAdFile[] => files.filter((f) => isAdType(f.adType, types));

/**
 * ORDER_COMP FULL/SIDE가 모두 있을 때 API 배열에서 먼저 등장한 슬롯을 선택한다.
 */
export const resolveOrderCompleteSlot = (
  files: readonly IGetMenuAdFile[]
): 'full' | 'side' | null => {
  let firstFullIdx = -1;
  let firstSideIdx = -1;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file) {
      continue;
    }
    const { adType } = file;
    if (firstFullIdx === -1 && isAdType(adType, ORDER_COMP_FULL_TYPES)) {
      firstFullIdx = i;
    }
    if (firstSideIdx === -1 && isAdType(adType, ORDER_COMP_SIDE_TYPES)) {
      firstSideIdx = i;
    }
    if (firstFullIdx !== -1 && firstSideIdx !== -1) {
      break;
    }
  }

  if (firstFullIdx === -1 && firstSideIdx === -1) {
    return null;
  }
  if (firstFullIdx === -1) {
    return 'side';
  }
  if (firstSideIdx === -1) {
    return 'full';
  }
  return firstFullIdx < firstSideIdx ? 'full' : 'side';
};

export type TGroupedAdFiles = {
  standbyFiles: IGetMenuAdFile[];
  topBannerFiles: IGetMenuAdFile[];
  orderCompleteFullFiles: IGetMenuAdFile[];
  orderCompleteSideFiles: IGetMenuAdFile[];
};

/** API 배열 순서를 유지하며 adType별로 분리한다. ORDER_COMP는 먼저 등장한 슬롯만 남긴다. */
export const groupAdFiles = (
  files: readonly IGetMenuAdFile[]
): TGroupedAdFiles => {
  const orderCompleteSlot = resolveOrderCompleteSlot(files);
  const fullFiles = filterByTypes(files, ORDER_COMP_FULL_TYPES);
  const sideFiles = filterByTypes(files, ORDER_COMP_SIDE_TYPES);

  return {
    standbyFiles: filterByTypes(files, STANDBY_TYPES),
    topBannerFiles: filterByTypes(files, TOP_BANNER_TYPES),
    orderCompleteFullFiles: orderCompleteSlot === 'side' ? [] : fullFiles,
    orderCompleteSideFiles: orderCompleteSlot === 'full' ? [] : sideFiles,
  };
};
