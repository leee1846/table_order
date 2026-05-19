import type {
  ICreateMenuRequest,
  IOptionGroup,
  IMenu,
  IGetMenu,
  TLocale,
} from '@repo/api/types';

export type FormValues = Omit<
  Partial<ICreateMenuRequest | IGetMenu>,
  'optionGroupList'
> & {
  optionGroupList?: IOptionGroup[];
  localeMenuName?: TLocale | null;
  localeMenuDescription?: TLocale | null;
};

export type ModalMode = 'create' | 'edit';

export interface FileWithId extends File {
  id: string;
}

export interface MenuImageData {
  id: string;
  file?: FileWithId;
  imagePath?: string;
  imageSeq?: number;
  imageName?: string;
  imageExtension?: string | null;
  isMainImage: boolean;
}

export interface MenuManageModalContextValue {
  mode: ModalMode;
  menu: IMenu | undefined;
  categorySeq: number;
  formValues: FormValues;
  updateFormValues: (values: FormValues) => void;
  mainImage: MenuImageData | null;
  additionalImages: MenuImageData[];
  setMainImage: (file: File) => void;
  setMainExistingImage: (image: MenuImageData) => void;
  removeMainImage: () => void;
  addAdditionalImages: (files: FileList | File[]) => void;
  addExistingImages: (images: MenuImageData[]) => void;
  removeAdditionalImage: (id: string) => void;
  replaceAdditionalImage: (id: string, file: File) => void;
  handleSubmit: () => Promise<void>;
  isSaving: boolean;
  onClose: () => void;
}

export const DEFAULT_FORM_VALUES: FormValues = {
  menuName: '',
  menuPrice: 0,
  menuDescription: '',
  isBest: false,
  isNew: false,
  spiceLevel: 0,
  isTaxFree: false,
  minQuantity: 0,
  isRecommended: false,
  isAdMenu: false,
  optionGroupList: [],
  selectedLanguageCode: 'KO',
  menuImageList: [],
};
