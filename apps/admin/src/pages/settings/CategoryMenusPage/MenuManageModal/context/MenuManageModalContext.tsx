import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from 'react';
import type { IMenu, IUpdateMenuRequest } from '@repo/api/types';
import {
  queryKeys,
  usePostCreateMenu,
  usePutUpdateMenu,
} from '@repo/api/queries';
import { useQueryClient } from '@repo/api/tanstack-query';
import type {
  FormValues,
  MenuManageModalContextValue,
  ModalMode,
} from './types';
import { getInitialFormValues, buildMenuData, buildUpdateData } from './utils';
import { useMenuImagesState } from './useMenuImagesState';

export type { MenuImageData, FileWithId, FormValues } from './types';

const MenuManageModalContext =
  createContext<MenuManageModalContextValue | null>(null);

/** 메뉴 폼 상태를 초기화/업데이트하는 전용 훅 */
const useMenuFormState = (menu: IMenu | undefined, categorySeq: number) => {
  const [formValues, setFormValues] = useState<FormValues>(() =>
    getInitialFormValues(menu, categorySeq)
  );

  useEffect(() => {
    setFormValues(getInitialFormValues(menu, categorySeq));
  }, [menu, categorySeq]);

  const updateFormValues = useCallback((nextValue: FormValues) => {
    setFormValues((prev) => ({ ...prev, ...nextValue }));
  }, []);

  return { formValues, updateFormValues };
};

interface Props {
  menu?: IMenu;
  categorySeq: number;
  onClose: () => void;
  children: ReactNode;
}

export const MenuManageModalProvider = ({
  menu,
  categorySeq,
  onClose,
  children,
}: Props) => {
  const queryClient = useQueryClient();

  const mode: ModalMode = menu ? 'edit' : 'create';
  const { mutateAsync: createMenu } = usePostCreateMenu();
  const { mutateAsync: updateMenu } = usePutUpdateMenu();

  const { formValues, updateFormValues } = useMenuFormState(
    menu,
    categorySeq
  );
  const images = useMenuImagesState({ menu, mode });

  const invalidateMenuList = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.menu.list(categorySeq),
    });
  }, [queryClient, categorySeq]);

  /** 공통 후처리를 모아 submit 플로우를 단순화 */
  const runMutation = useCallback(
    async (mutation: () => Promise<unknown>) => {
      await mutation();
      onClose();
      invalidateMenuList();
    },
    [onClose, invalidateMenuList]
  );

  const handleCreate = useCallback(async () => {
    const files = images.getFiles();
    const menuData = buildMenuData(
      formValues,
      categorySeq,
      images.getMenuImageList()
    );

    console.log(menuData, files);
    await runMutation(() => createMenu({ menu: menuData, files }));
  }, [
    formValues,
    categorySeq,
    images,
    runMutation,
    createMenu,
  ]);

  const handleUpdate = useCallback(async () => {
    if (!menu) return;

    const files = images.getFiles();
    const menuImageList = images.getUpdateMenuImageList(menu.menuSeq);
    const updateData: IUpdateMenuRequest = buildUpdateData(
      menu,
      formValues,
      menuImageList
    );

    console.log('updateData, files', updateData, files);

    await runMutation(() => updateMenu({ menu: updateData, files }));
  }, [menu, formValues, images, runMutation, updateMenu]);

  const handleSubmit = useCallback(async () => {
    try {
      if (mode === 'create') {
        await handleCreate();
      } else {
        await handleUpdate();
      }
    } catch (error) {
      console.error(`메뉴 ${mode === 'create' ? '생성' : '수정'} 실패:`, error);
    }
  }, [mode, handleCreate, handleUpdate]);

  const value = useMemo<MenuManageModalContextValue>(
    () => ({
      mode,
      menu,
      categorySeq,
      formValues,
      updateFormValues,
      mainImage: images.mainImage,
      additionalImages: images.additionalImages,
      setMainImage: images.setMainImage,
      removeMainImage: images.removeMainImage,
      addAdditionalImages: images.addAdditionalImages,
      removeAdditionalImage: images.removeAdditionalImage,
      handleSubmit,
      onClose,
    }),
    [
      mode,
      menu,
      categorySeq,
      formValues,
      updateFormValues,
      images.mainImage,
      images.additionalImages,
      images.setMainImage,
      images.removeMainImage,
      images.addAdditionalImages,
      images.removeAdditionalImage,
      handleSubmit,
      onClose,
    ]
  );

  return (
    <MenuManageModalContext.Provider value={value}>
      {children}
    </MenuManageModalContext.Provider>
  );
};

export const useMenuManageModal = (): MenuManageModalContextValue => {
  const context = useContext(MenuManageModalContext);
  if (!context) {
    // HMR 이슈로 인한 에러 방지를 위해 기본값 반환 대신 에러 throw
    // 개발 중 이 에러가 발생하면 페이지를 새로고침하세요
    throw new Error(
      'useMenuManageModal must be used within MenuManageModalProvider. Try refreshing the page.'
    );
  }
  return context;
};

export const useMenuForm = () => {
  const { formValues, updateFormValues } = useMenuManageModal();
  return { formValues, updateFormValues };
};

export const useMenuImages = () => {
  const {
    mainImage,
    additionalImages,
    setMainImage,
    removeMainImage,
    addAdditionalImages,
    removeAdditionalImage,
  } = useMenuManageModal();
  return {
    mainImage,
    additionalImages,
    setMainImage,
    removeMainImage,
    addAdditionalImages,
    removeAdditionalImage,
  };
};
