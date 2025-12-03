import type {
  ICreateMenuImage,
  ICreateMenuRequest,
  ICreateOption,
  ICreateOptionGroup,
  IMenu,
  IMenuImage,
  IOption,
  IOptionGroup,
  IUpdateMenuRequest,
  IUpdateOption,
  IUpdateOptionGroup,
} from '@repo/api/types';
import { generateId } from '@repo/util/string';
import {
  DEFAULT_FORM_VALUES,
  type FileWithId,
  type FormValues,
  type MenuImageData,
} from './types';

export const getInitialFormValues = (
  menu?: IMenu,
  categorySeq?: number
): FormValues => {
  if (!menu) return { ...DEFAULT_FORM_VALUES, categorySeq };

  return {
    menuName: menu.menuName ?? '',
    menuPrice: menu.menuPrice ?? undefined,
    menuDescription: menu.menuDescription ?? '',
    isBest: menu.isBest ?? false,
    isNew: menu.isNew ?? false,
    spiceLevel: menu.spiceLevel ?? 0,
    isTaxFree: menu.isTaxFree ?? false,
    minQuantity: menu.minQuantity ?? 0,
    mappedMenuCode: menu.mappedMenuCode ?? undefined,
    categorySeq: menu.categorySeq,
    isRecommended: menu.isRecommended ?? false,
    optionGroupList: menu.optionGroupList ?? [],
    selectedLanguageCode: menu.selectedLanguageCode ?? 'KO',
    menuImageList: menu.menuImageList ?? [],
  };
};

export const createFileWithId = (file: File): FileWithId =>
  Object.assign(file, { id: generateId() }) as FileWithId;

export const createMenuImageData = (
  file: File,
  isMainImage: boolean
): MenuImageData => {
  const fileWithId = createFileWithId(file);
  return { id: fileWithId.id, file: fileWithId, isMainImage };
};

export const toExistingImageData = (
  image: IMenuImage,
  isMainImage: boolean
): MenuImageData => ({
  id: `existing-${image.imageSeq}`,
  imagePath: image.imagePath ?? undefined,
  imageSeq: image.imageSeq,
  isMainImage,
});

export const createFileForUpload = (file: FileWithId): File => {
  const ext = file.name.substring(file.name.lastIndexOf('.'));
  return new File([file], `${file.id}${ext}`, { type: file.type });
};

export const isExistingImage = (id: string) => id.startsWith('existing-');

export const parseImageSeq = (id: string) =>
  parseInt(id.replace('existing-', ''), 10);

/** 옵션을 ICreateOption으로 변환 (음수 시퀀스 제거) */
const toCreateOption = (option: IOption): ICreateOption => {
  const {
    optionSeq,
    optionGroupSeq,
    isDeleted,
    quantity,
    localeOptionName,
    localeOptionNameStr,
    mappedOptionGroupCode,
    mappedOptionGroupName,
    mappedHeadOptionGroupCode,
    mappedUptDt,
    isMapped,
    createDate,
    createMemberUuid,
    updateDate,
    updateMemberUuid,
    ...createOption
  } = option;
  return createOption;
};

/** 옵션을 IUpdateOption으로 변환 (음수 시퀀스는 0으로) */
const toUpdateOption = (
  option: IOption,
  optionGroupSeq: number
): IUpdateOption => {
  const {
    quantity,
    localeOptionName,
    localeOptionNameStr,
    mappedOptionGroupCode,
    mappedOptionGroupName,
    mappedHeadOptionGroupCode,
    mappedUptDt,
    isMapped,
    createDate,
    createMemberUuid,
    updateDate,
    updateMemberUuid,
    ...updateOption
  } = option;
  return {
    ...updateOption,
    optionSeq: updateOption.optionSeq < 0 ? 0 : updateOption.optionSeq,
    optionGroupSeq,
  };
};

/** 신규 옵션 그룹을 ICreateOptionGroup으로 변환 */
const toCreateOptionGroup = (group: IOptionGroup): ICreateOptionGroup => {
  const {
    optionGroupSeq, // 서버에 전송하지 않는 필드들을 제거하고 나머지만 사용
    localeOptionGroupName,
    localeOptionGroupNameStr,
    optionList,
    ...createGroup
  } = group;

  return {
    ...createGroup, // 필요한 필드들만 포함
    optionList: (optionList || []).map(toCreateOption), // 옵션 리스트를 변환하여 다시 넣음
  };
};

/** 기존 옵션 그룹을 IUpdateOptionGroup으로 변환 */
const toUpdateOptionGroup = (group: IOptionGroup): IUpdateOptionGroup => {
  const {
    localeOptionGroupName,
    localeOptionGroupNameStr,
    optionList,
    ...updateGroup
  } = group;
  return {
    ...updateGroup,
    optionList: (optionList || []).map((opt) =>
      toUpdateOption(opt, group.optionGroupSeq)
    ),
  };
};

/** POST 요청용: 옵션 그룹 리스트를 ICreateOptionGroup[]로 변환 */
const convertOptionGroupList = (
  optionGroupList: IOptionGroup[] = []
): ICreateOptionGroup[] =>
  optionGroupList.map((group) =>
    group.optionGroupSeq < 0
      ? toCreateOptionGroup(group)
      : (group as unknown as ICreateOptionGroup)
  );

/** PUT 요청용: 옵션 그룹 리스트를 IUpdateOptionGroup[] 또는 ICreateOptionGroup[]로 변환 */
const convertOptionGroupListForUpdate = (
  optionGroupList: IOptionGroup[] = []
): (IUpdateOptionGroup | ICreateOptionGroup)[] =>
  optionGroupList.map((group) =>
    group.optionGroupSeq < 0
      ? toCreateOptionGroup(group)
      : toUpdateOptionGroup(group)
  );

/** 메뉴 생성용 데이터 빌드 */
export const buildMenuData = (
  formValues: FormValues,
  categorySeq: number,
  menuImageList: ICreateMenuImage[]
): ICreateMenuRequest => ({
  menuName: formValues.menuName ?? '',
  categorySeq,
  menuPrice: formValues.menuPrice ?? 0,
  isRecommended: formValues.isRecommended ?? false,
  menuDescription: formValues.menuDescription ?? '',
  isBest: formValues.isBest ?? false,
  isNew: formValues.isNew ?? false,
  spiceLevel: formValues.spiceLevel ?? 0,
  isTaxFree: formValues.isTaxFree ?? false,
  minQuantity: formValues.minQuantity ?? 0,
  optionGroupList: convertOptionGroupList(
    formValues.optionGroupList
  ) as unknown as IOptionGroup[],
  selectedLanguageCode: formValues.selectedLanguageCode ?? 'KO',
  menuImageList,
});

/** 메뉴 수정용 데이터 빌드 - formValues 우선, 없으면 기존 menu 값 사용 */
export const buildUpdateData = (
  menu: IMenu,
  formValues: FormValues,
  menuImageList: IMenuImage[]
): IUpdateMenuRequest => {
  const optionGroupList = formValues.optionGroupList ?? menu.optionGroupList;
  const convertedOptionGroupList = optionGroupList
    ? convertOptionGroupListForUpdate(optionGroupList)
    : undefined;

  return {
    menuSeq: menu.menuSeq,
    menuName: formValues.menuName ?? menu.menuName,
    categorySeq: formValues.categorySeq ?? menu.categorySeq,
    menuPrice: formValues.menuPrice ?? menu.menuPrice,
    isOutOfStock: menu.isOutOfStock,
    mappedMenuCode: formValues.mappedMenuCode ?? menu.mappedMenuCode,
    isHidden: menu.isHidden,
    isRecommended: formValues.isRecommended ?? menu.isRecommended,
    menuDescription: formValues.menuDescription ?? menu.menuDescription,
    isBest: formValues.isBest ?? menu.isBest,
    isNew: formValues.isNew ?? menu.isNew,
    spiceLevel: formValues.spiceLevel ?? menu.spiceLevel,
    isTaxFree: formValues.isTaxFree ?? menu.isTaxFree,
    minQuantity: formValues.minQuantity ?? menu.minQuantity,
    optionGroupList: (convertedOptionGroupList as IOptionGroup[]) ?? undefined,
    selectedLanguageCode:
      formValues.selectedLanguageCode ?? menu.selectedLanguageCode,
    menuImageList,
  };
};
