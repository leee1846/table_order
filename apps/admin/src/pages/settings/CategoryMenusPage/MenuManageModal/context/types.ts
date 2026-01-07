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
  removeMainImage: () => void;
  addAdditionalImages: (files: FileList | File[]) => void;
  removeAdditionalImage: (id: string) => void;
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
  optionGroupList: [],
  selectedLanguageCode: 'KO',
  menuImageList: [],
};
