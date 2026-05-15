import type {
  ICreateMenuImage,
  ICreateMenuRequest,
  ICreateOption,
  ICreateOptionGroup,
  IGetMenu,
  IMenu,
  IMenuImage,
  IOption,
  IOptionGroup,
  IUpdateMenuRequest,
  IUpdateOption,
  IUpdateOptionGroup,
  TLocale,
  TShopLanguage,
} from '@repo/api/types';
import { generateId } from '@repo/util/string';
import {
  DEFAULT_FORM_VALUES,
  type FileWithId,
  type FormValues,
  type MenuImageData,
} from './types';
import type { i18n } from 'i18next';

export const getInitialFormValues = (
  menu: IGetMenu | undefined,
  categorySeq: number | undefined,
  i18nInstance: i18n
): FormValues => {
  const currentLanguage = (i18nInstance.language?.toUpperCase() ||
    'KO') as TShopLanguage;

  if (!menu) {
    return { ...DEFAULT_FORM_VALUES, categorySeq };
  }

  return {
    menuName: menu.localeMenuName?.[currentLanguage] ?? '',
    menuPrice: menu.menuPrice ?? undefined,
    menuDescription: menu.localeMenuDescription?.[currentLanguage] ?? '',
    isBest: menu.isBest ?? false,
    isNew: menu.isNew ?? false,
    spiceLevel: menu.spiceLevel ?? 0,
    isTaxFree: menu.isTaxFree ?? false,
    minQuantity: menu.minQuantity ?? 0,
    mappedMenuCode: menu.mappedMenuCode ?? undefined,
    categorySeq: menu.categorySeq,
    isRecommended: menu.isRecommended ?? false,
    optionGroupList: syncOptionGroupListForLanguage(
      menu.optionGroupList ?? [],
      currentLanguage
    ),
    selectedLanguageCode: currentLanguage,
    menuImageList: menu.menuImageList ?? [],
    localeMenuName: menu.localeMenuName ?? null,
    localeMenuDescription: menu.localeMenuDescription ?? null,
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
  imageName: image.imageName,
  imageExtension: image.imageExtension ?? null,
  isMainImage,
});

export const createFileForUpload = (file: FileWithId): File => {
  const ext = file.name.substring(file.name.lastIndexOf('.'));
  return new File([file], `${file.id}${ext}`, { type: file.type });
};

export const isExistingImage = (id: string) => id.startsWith('existing-');

export const parseImageSeq = (id: string) =>
  parseInt(id.replace('existing-', ''), 10);

/** locale 맵에서 선택 언어 이름을 가져오고, 없으면 flat 필드를 사용 */
export const resolveLocalizedName = (
  locale: TLocale | null | undefined,
  languageCode: string,
  fallback: string
): string => locale?.[languageCode] ?? fallback;

/** 선택 언어에 맞게 옵션 그룹/옵션의 flat 이름을 locale 기준으로 동기화 */
export const syncOptionGroupListForLanguage = (
  optionGroupList: IOptionGroup[],
  languageCode: TShopLanguage
): IOptionGroup[] =>
  optionGroupList.map((group) => ({
    ...group,
    optionGroupName: resolveLocalizedName(
      group.localeOptionGroupName,
      languageCode,
      group.optionGroupName
    ),
    optionList: (group.optionList ?? []).map((option) => ({
      ...option,
      optionName: resolveLocalizedName(
        option.localeOptionName,
        languageCode,
        option.optionName
      ),
    })),
  }));

const upsertLocaleEntry = (
  locale: TLocale | null | undefined,
  languageCode: string,
  name: string
): TLocale => ({
  ...(locale ?? {}),
  [languageCode]: name,
});

/** 옵션 그룹 모달 저장 시: 기존 그룹에 현재 언어 이름을 locale·flat 모두 반영 */
export const mergeOptionGroupForLanguage = (
  existing: IOptionGroup,
  updates: Pick<
    IOptionGroup,
    | 'optionGroupName'
    | 'menuSeq'
    | 'index'
    | 'minQuantity'
    | 'maxQuantity'
    | 'isMultipleSelectable'
    | 'isOptionQuantitySelectable'
    | 'isMenuQuantityIndependent'
  > & { optionList: IUpdateOption[] },
  languageCode: string
): IOptionGroup => {
  const optionGroupName = updates.optionGroupName.trim();

  const optionList = updates.optionList.map((savedOption) => {
    const existingOption =
      savedOption.optionSeq > 0
        ? existing.optionList?.find(
            (option) => option.optionSeq === savedOption.optionSeq
          )
        : undefined;

    const optionName = savedOption.optionName.trim();

    return {
      ...(existingOption ?? ({} as IOption)),
      ...savedOption,
      optionName,
      localeOptionName: upsertLocaleEntry(
        existingOption?.localeOptionName,
        languageCode,
        optionName
      ),
    } as IOption;
  });

  return {
    ...existing,
    ...updates,
    optionGroupName,
    localeOptionGroupName: upsertLocaleEntry(
      existing.localeOptionGroupName,
      languageCode,
      optionGroupName
    ),
    optionList,
  };
};

/** 신규 옵션 그룹 form 저장 시: 현재 언어 locale·flat 이름 설정 */
export const createOptionGroupForLanguage = (
  group: IOptionGroup,
  languageCode: string
): IOptionGroup => {
  const optionGroupName = group.optionGroupName.trim();

  return {
    ...group,
    optionGroupName,
    localeOptionGroupName: upsertLocaleEntry(
      group.localeOptionGroupName,
      languageCode,
      optionGroupName
    ),
    optionList: (group.optionList ?? []).map((option) => {
      const optionName = option.optionName.trim();
      return {
        ...option,
        optionName,
        localeOptionName: upsertLocaleEntry(
          option.localeOptionName,
          languageCode,
          optionName
        ),
      };
    }),
  };
};

/** 옵션을 ICreateOption으로 변환 */
const toCreateOption = (option: IOption): ICreateOption => ({
  optionName: option.optionName,
  optionPrice: option.optionPrice,
  index: option.index,
  isOutOfStock: option.isOutOfStock,
});

/** 옵션을 IUpdateOption으로 변환 */
const toUpdateOption = (
  option: IOption,
  optionGroupSeq: number
): IUpdateOption => ({
  optionSeq: option.optionSeq > 0 ? option.optionSeq : 0,
  optionGroupSeq,
  optionName: option.optionName,
  optionPrice: option.optionPrice,
  isDeleted: option.isDeleted,
  index: option.index,
  isOutOfStock: option.isOutOfStock,
});

/** 신규 옵션 그룹을 ICreateOptionGroup으로 변환 */
const toCreateOptionGroup = (group: IOptionGroup): ICreateOptionGroup => ({
  optionGroupName: group.optionGroupName,
  menuSeq: group.menuSeq,
  index: group.index,
  minQuantity: group.minQuantity,
  maxQuantity: group.maxQuantity,
  isMultipleSelectable: group.isMultipleSelectable,
  isOptionQuantitySelectable: group.isOptionQuantitySelectable,
  isMenuQuantityIndependent: group.isMenuQuantityIndependent ?? false,
  optionList: (group.optionList || []).map(toCreateOption),
});

/** 기존 옵션 그룹을 IUpdateOptionGroup으로 변환 */
const toUpdateOptionGroup = (group: IOptionGroup): IUpdateOptionGroup => {
  const { optionList, ...updateGroup } = group;
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
    group.optionGroupSeq <= 0
      ? toCreateOptionGroup(group)
      : toUpdateOptionGroup(group)
  );

/** 메뉴 생성용 데이터 빌드 */
export const buildMenuData = (
  formValues: FormValues,
  categorySeq: number,
  menuImageList: ICreateMenuImage[],
  i18nInstance: i18n
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
  ) as unknown as ICreateOptionGroup[],
  selectedLanguageCode: (i18nInstance.language?.toUpperCase() ||
    'KO') as TShopLanguage,
  menuImageList,
});

/** 메뉴 수정용 데이터 빌드 - formValues 우선, 없으면 기존 menu 값 사용 */
export const buildUpdateData = (
  menu: IMenu,
  formValues: FormValues,
  menuImageList: IMenuImage[]
): IUpdateMenuRequest => {
  const selectedLanguageCode = (formValues.selectedLanguageCode ??
    menu.selectedLanguageCode ??
    'KO') as TShopLanguage;

  const rawOptionGroupList =
    formValues.optionGroupList ?? menu.optionGroupList ?? [];

  const optionGroupListForLanguage = syncOptionGroupListForLanguage(
    rawOptionGroupList,
    selectedLanguageCode
  );

  const convertedOptionGroupList = convertOptionGroupListForUpdate(
    optionGroupListForLanguage
  );

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
    minQuantity: formValues.minQuantity ?? 0,
    optionGroupList: (convertedOptionGroupList as IOptionGroup[]) ?? undefined,
    selectedLanguageCode,
    menuImageList,
  };
};
