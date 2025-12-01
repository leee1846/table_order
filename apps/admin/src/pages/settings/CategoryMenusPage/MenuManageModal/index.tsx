import { useEffect, useState } from 'react';
import * as S from '@/pages/settings/CategoryMenusPage/MenuManageModal/menuManageModal.style';
import { ChevronForwardIcon, CloseIcon } from '@repo/ui/icons';
import { theme } from '@repo/ui';
import { BasicSetting } from '@/pages/settings/CategoryMenusPage/MenuManageModal/BasicSetting';
import { OptionSetting } from '@/pages/settings/CategoryMenusPage/MenuManageModal/OptionSetting';
import type {
  ICreateMenuRequest,
  IMenu,
  ICreateMenuImage,
} from '@repo/api/types';
import { BasicButton } from '@repo/ui/components';
import { AdditionalSetting } from './AdditionalSetting';
import { queryKeys, usePostCreateMenu } from '@repo/api/queries';
import { useQueryClient } from '@repo/api/tanstack-query';

interface MenuManageModalProps {
  menu?: IMenu;
  categorySeq: number;
  onClose: () => void;
}

const getInitialFormValues = (
  menu?: IMenu,
  categorySeq?: number
): Partial<ICreateMenuRequest> => {
  if (!menu) {
    return {
      categorySeq: categorySeq ?? 0,
      isBest: false,
      isNew: false,
      spiceLevel: 0,
      isTaxFree: false,
      isRecommended: false,
      optionGroupList: [],
      selectedLanguageCode: 'KO',
      menuImageList: [],
      minQuantity: 0,
    };
  }

  return {
    menuName: menu.menuName ?? '',
    menuPrice: menu.menuPrice ?? undefined,
    menuDescription: menu.menuDescription ?? '',
    isBest: menu.isBest ?? false,
    isNew: menu.isNew ?? false,
    spiceLevel: menu.spiceLevel ?? 0,
    isTaxFree: menu.isTaxFree ?? false,
    minQuantity: menu.minQuantity ?? undefined,
    touchKeyColorCode: menu.touchKeyColorCode ?? undefined,
    mappedMenuCode: menu.mappedMenuCode ?? undefined,
    categorySeq: menu.categorySeq,
    isRecommended: menu.isRecommended ?? false,
    optionGroupList: menu.optionGroupList ?? [],
    selectedLanguageCode: menu.selectedLanguageCode ?? 'KO',
    menuImageList: [],
  };
};

interface FileWithId extends File {
  id: string; // UUID 또는 timestamp
}

const timestamp = (): string => {
  return Date.now().toString();
};

export const MenuManageModal = ({
  menu,
  categorySeq,
  onClose,
}: MenuManageModalProps) => {
  const queryClient = useQueryClient();
  const mode = menu ? 'edit' : 'create';

  const { mutateAsync: createMenu } = usePostCreateMenu();
  const [formValues, setFormValues] = useState<Partial<ICreateMenuRequest>>(
    () => getInitialFormValues(menu, categorySeq)
  );
  const [imageFiles, setImageFiles] = useState<FileWithId[]>([]);

  useEffect(() => {
    if (menu) {
      setFormValues(getInitialFormValues(menu, categorySeq));
    } else {
      setFormValues(getInitialFormValues(undefined, categorySeq));
    }
  }, [menu, categorySeq]);

  const handleChange = (nextValue: Partial<ICreateMenuRequest>) => {
    setFormValues((prev) => ({ ...prev, ...nextValue }));
  };

  // 파일 추가 함수 (타임스탬프로 고유 ID 생성)
  const handleAddFiles = (files: FileList | null) => {
    if (!files) {
      return;
    }

    const newFiles: FileWithId[] = Array.from(files).map((file) => {
      // timestamp로 고유 ID 생성
      const id = timestamp();
      const fileWithId = Object.assign(file, { id }) as FileWithId;
      return fileWithId;
    });

    setImageFiles((prev) => [...prev, ...newFiles]);
  };

  const modalTitle = mode === 'create' ? '메뉴 추가' : '메뉴 수정';
  const menuName = formValues.menuName || menu?.menuName;

  const handleSubmit = async () => {
    if (mode === 'create') {
      // 이미지 파일이 있으면 menuImageList 생성 (파일명과 imageName 매칭)

      const menuImageList: ICreateMenuImage[] = imageFiles.map(
        (file, index) => ({
          imageName: file.id, // 파일의 고유 ID (UUID 또는 timestamp)
          imageIndex: index,
          isMainImage: index === 0, // 첫 번째 이미지를 메인 이미지로 설정
        })
      );

      const menuData: ICreateMenuRequest = {
        menuName: formValues.menuName ?? '',
        categorySeq: formValues.categorySeq ?? categorySeq,
        menuPrice: formValues.menuPrice ?? 0,
        isRecommended: formValues.isRecommended ?? false,
        menuDescription: formValues.menuDescription ?? null,
        isBest: formValues.isBest ?? false,
        isNew: formValues.isNew ?? false,
        spiceLevel: formValues.spiceLevel ?? 0,
        isTaxFree: formValues.isTaxFree ?? false,
        minQuantity: formValues.minQuantity ?? 0,
        touchKeyColorCode: formValues.touchKeyColorCode ?? null,
        optionGroupList: formValues.optionGroupList ?? [],
        selectedLanguageCode: formValues.selectedLanguageCode ?? 'KO',
        menuImageList: menuImageList.length > 0 ? menuImageList : [],
      };

      try {
        const files = imageFiles.map((file) => {
          const originalName = file.name;
          const extension = originalName.substring(
            originalName.lastIndexOf('.')
          );

          const fileName = `${file.id}${extension}`;
          const newFile = new File([file], fileName, { type: file.type });
          return newFile;
        });

        await createMenu({
          menu: menuData,
          files: files.length > 0 ? files : [],
        });
        onClose();

        queryClient.invalidateQueries({
          queryKey: queryKeys.menu.list(categorySeq),
        });
      } catch (error) {
        console.error('메뉴 생성 실패:', error);
      }
    }
  };

  return (
    <S.Container>
      <S.Header>
        <S.Titles>
          <p>메뉴 관리</p>
          <span />
          <div>
            {menuName && mode === 'edit' && <p>{menuName}</p>}
            {menuName && mode === 'edit' && (
              <ChevronForwardIcon
                color={theme.colors.grey[600]}
                width={24}
                height={24}
              />
            )}
            <p>{modalTitle}</p>
          </div>
        </S.Titles>

        <button type="button" onClick={onClose}>
          <CloseIcon width={42} height={42} color={theme.colors.grey[500]} />
        </button>
      </S.Header>
      <BasicSetting
        menu={menu}
        values={formValues}
        onChange={handleChange}
        onAddFiles={handleAddFiles}
      />
      <OptionSetting />

      <AdditionalSetting
        values={{
          minQuantity: formValues.minQuantity ?? 0,
          mappedMenuCode: formValues.mappedMenuCode ?? '',
        }}
        onChange={handleChange}
      />
      <BasicButton variant="Solid_Navy_2XL" onClick={handleSubmit}>
        저장
      </BasicButton>
    </S.Container>
  );
};
